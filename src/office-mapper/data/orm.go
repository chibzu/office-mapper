package data

import (
	"database/sql"
	"fmt"
	"office-mapper/config"
	"reflect"
	"strconv"
	"strings"
	"unicode"
)

func sqlCase(s string) string {
	s = strings.ToLower(s[0:1]) + s[1:]
	for i := 0; i < len(s); i++ {
		if unicode.IsUpper(rune(s[i])) {
			s = s[:i] + "_" + strings.ToLower(s[i:i+1]) + s[i+1:]
		}
	}

	return s
}

func depluralize(s string) string {
	return strings.TrimSuffix(s, "s")
}

func tableName(s string) string {
	return strings.TrimPrefix(sqlCase(s), "full_") + "s"
}

func extractStructureFieldAddress(v reflect.Value, columnMaps map[string]interface{}) {
	for i := 0; i < v.NumField(); i++ {
		if v.Type().Field(i).Type.Kind() == reflect.Struct {
			extractStructureFieldAddress(v.Field(i), columnMaps)
			continue
		}

		fieldName := v.Type().Field(i).Name
		columnName := sqlCase(fieldName)
		if tag := v.Type().Field(i).Tag.Get("sql"); tag != "" {
			columnName = tag
		}
		columnMaps[columnName] = v.Field(i).Addr().Interface()
	}

}

func extractRow(rv reflect.Value, rows *sql.Rows) {
	columns, err := rows.Columns()
	if err != nil {
		panic("Error extracing column names")
	}

	columnMaps := map[string]interface{}{}
	extractStructureFieldAddress(rv, columnMaps)

	scanInto := make([]interface{}, len(columns))
	for i, column := range columns {
		if addr, ok := columnMaps[column]; ok {
			scanInto[i] = addr
		}
	}
	rows.Scan(scanInto...)
}

func loadAll(result interface{}) error {
	v := reflect.ValueOf(result)
	if v.Kind() != reflect.Ptr {
		panic("loadAll passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Slice {
		panic("loadAll passed a pointer to a non-slice type " + v.Kind().String())
	}
	if v.Type().Elem().Kind() != reflect.Struct {
		panic("loadAll passed an slice of non-structs")
	}

	elemType := v.Type().Elem()
	table := tableName(elemType.Name())
	rows, err := config.DB.Query(`SELECT * FROM ` + table)
	if err != nil {
		return err
	}

	for rows.Next() {
		rv := reflect.New(elemType).Elem()
		extractRow(rv, rows)
		v.Set(reflect.Append(v, rv))
	}

	return nil
}

func loadOneBy(id string, idField string, result interface{}) error {
	v := reflect.ValueOf(result)
	if v.Kind() != reflect.Ptr {
		panic("loadOne passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Ptr {
		panic("loadOne passed a pointer to a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Struct {
		panic("loadOne passed a pointer to a non-structure type " + v.Kind().String())
	}

	elemType := v.Type()
	table := tableName(elemType.Name())
	rows, err := config.DB.Query(`SELECT * FROM `+table+` WHERE `+idField+` = ?`, id)
	if err != nil {
		return err
	}

	found := false

	for rows.Next() {
		extractRow(v, rows)
		found = true
	}

	if !found {
		v := reflect.ValueOf(result).Elem()
		v.Set(reflect.Zero(v.Type()))
	}

	return nil
}

func loadOne(id int, result interface{}) error {
	return loadOneBy(strconv.Itoa(id), "id", result)
}

func extractStructureFieldValues(v reflect.Value, columnMaps map[string]interface{}) {
	for i := 0; i < v.NumField(); i++ {
		if v.Type().Field(i).Type.Kind() == reflect.Struct {
			extractStructureFieldValues(v.Field(i), columnMaps)
			continue
		}

		fieldName := v.Type().Field(i).Name
		columnName := sqlCase(fieldName)
		if tag := v.Type().Field(i).Tag.Get("sql"); tag != "" {
			columnName = tag
		}
		columnMaps[columnName] = v.Field(i).Interface()
	}
}

func insertOne(input interface{}) error {
	v := reflect.ValueOf(input)
	if v.Kind() != reflect.Ptr {
		panic("insertOne passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Struct {
		panic("insertOne passed a pointer to a non-structure")
	}

	elemType := v.Type()
	table := tableName(elemType.Name())

	columnMaps := map[string]interface{}{}
	extractStructureFieldValues(v, columnMaps)
	setFields := []string{}
	setValues := []interface{}{}
	for f, v := range columnMaps {
		setFields = append(setFields, f+" = ?")
		setValues = append(setValues, v)
	}
	result, err := config.DB.Exec(`INSERT INTO `+table+` SET `+strings.Join(setFields, ", "), setValues...)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	field := v.FieldByName("Id")
	if field.IsValid() {
		field.SetInt(id)
	}

	return nil
}

func getSqlFieldsFromJson(updateData map[string]interface{}, v reflect.Value, sqlData map[string]interface{}) error {
	for i := 0; i < v.NumField(); i++ {
		if v.Type().Field(i).Type.Kind() == reflect.Struct {
			subUpdateData := updateData
			if tag := v.Type().Field(i).Tag.Get("json"); tag != "" {
				maybeSubUpdateData := updateData[tag]
				if yesSubUpdateData, ok := maybeSubUpdateData.(map[string]interface{}); ok {
					subUpdateData = yesSubUpdateData
				}
			}
			getSqlFieldsFromJson(subUpdateData, v.Field(i), sqlData)
			continue
		}

		fieldName := v.Type().Field(i).Name
		columnName := sqlCase(fieldName)
		if tag := v.Type().Field(i).Tag.Get("sql"); tag != "" {
			columnName = tag
		}
		jsonName := fieldName
		if tag := v.Type().Field(i).Tag.Get("json"); tag != "" {
			jsonName = tag
		}
		if val, ok := updateData[jsonName]; ok {
			sqlData[columnName] = val
		}
	}
	return nil
}

func updateOne(id int, updateData map[string]interface{}, obj interface{}) error {
	v := reflect.ValueOf(obj)
	if v.Kind() != reflect.Ptr {
		panic("updateOne passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Ptr {
		panic("updateOne passed a pointer to a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Struct {
		panic("updateOne passed a pointer to a non-structure: " + v.Kind().String())
	}

	elemType := v.Type()
	table := tableName(elemType.Name())

	sqlData := map[string]interface{}{}
	getSqlFieldsFromJson(updateData, v, sqlData)

	setFields := []string{}
	setValues := []interface{}{}
	for c, v := range sqlData {
		setFields = append(setFields, c+" = ?")
		setValues = append(setValues, v)
	}

	setValues = append(setValues, id)

	if len(setFields) > 0 {
		_, err := config.DB.Exec(`UPDATE `+table+` SET `+strings.Join(setFields, ", ")+` WHERE id = ?`, setValues...)
		if err != nil {
			return err
		}
	}

	return loadOne(id, obj)
}

func chainToJoins(lastTable string, chain []string) string {
	joins := ""
	for _, t := range chain {
		joins = joins + fmt.Sprintf(" JOIN %s ON (%s.%s_id = %s.id)", t, lastTable, depluralize(t), t)
		lastTable = t
	}
	return joins
}

func loadChain(chain []string, id_field string, id int, result interface{}) error {
	v := reflect.ValueOf(result)
	if v.Kind() != reflect.Ptr {
		panic("loadChain passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Slice {
		panic("loadChain passed a pointer to a non-slice type " + v.Kind().String())
	}
	if v.Type().Elem().Kind() != reflect.Ptr {
		panic("loadChain passed an slice of non-pointers")
	}
	if v.Type().Elem().Elem().Kind() != reflect.Struct {
		panic("loadChain passed an slice of pointers to non-structs")
	}

	elemType := v.Type().Elem().Elem()
	table := tableName(elemType.Name())

	joins := chainToJoins(table, chain)

	slect := "SELECT " + table + ".* FROM " + table
	where := " WHERE " + chain[len(chain)-1] + "." + id_field + " = ?"

	rows, err := config.DB.Query(slect+joins+where, id)
	if err != nil {
		return err
	}

	for rows.Next() {
		rv := reflect.New(elemType).Elem()
		extractRow(rv, rows)
		v.Set(reflect.Append(v, rv.Addr()))
	}

	return nil
}

func isNil(obj interface{}) bool {
	v := reflect.ValueOf(obj)
	return v.Elem().IsNil()
}

func structToMapAux(obj interface{}) interface{} {
	v := reflect.ValueOf(obj)
	switch v.Kind() {
	case reflect.Ptr:
		if v.IsNil() {
			return nil
		}
		return structToMapAux(v.Elem().Interface())
	case reflect.Struct:
		mp := map[string]interface{}{}
		for i := 0; i < v.NumField(); i++ {
			fieldName := v.Type().Field(i).Name
			if tag := v.Type().Field(i).Tag.Get("json"); tag != "" {
				fieldName = tag
			}
			mp[fieldName] = structToMapAux(v.Field(i).Interface())
		}
		return mp
	case reflect.Slice, reflect.Array:
		arr := make([]interface{}, v.Len())
		for i := 0; i < v.Len(); i++ {
			arr[i] = structToMap(v.Index(i).Interface())
		}
		return arr
	}
	return obj
}

func structToMap(obj interface{}) map[string]interface{} {
	return structToMapAux(obj).(map[string]interface{})
}

func addMapId(objs []map[string]interface{}, chain []string) error {
	joins := ""
	if len(chain) > 1 {
		joins = chainToJoins(chain[0], chain[1:])
	}
	ids := []string{}
	objMap := map[int]map[string]interface{}{}
	for _, obj := range objs {
		ids = append(ids, strconv.Itoa(obj["id"].(int)))
		objMap[obj["id"].(int)] = obj
		obj["mapId"] = nil
	}
	idList := "(" + strings.Join(ids, ", ") + ")"
	query := fmt.Sprintf(`SELECT %v.id, map_id FROM %v %v WHERE %v.id IN %v`, chain[0], chain[0], joins, chain[0], idList)

	rows, err := config.DB.Query(query)
	if err != nil {
		return err
	}

	for rows.Next() {
		var id, mapId int
		rows.Scan(&id, &mapId)
		objMap[id]["mapId"] = mapId
	}

	return nil
}
