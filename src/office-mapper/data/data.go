package data

import (
	"office-mapper/config"
)

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type Map struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Url  string `json:"url"`
}

type Section struct {
	Id       int      `json:"id"`
	Name     string   `json:"name"`
	Position Position `json:"position"`
}

type User struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	DeskId       int    `json:"deskId"`
	Email        string `json:"email"`
	ThumbnailUrl string `json:"thumbnailUrl"`
}

type Features struct {
	Chromecast bool `json:"chromecast"`
	Phone      bool `json:"phone"`
	Tv         bool `json:"tv"`
	Seats      int  `json:"seats"`
}

type Room struct {
	Id        int      `json:"id"`
	Name      string   `json:"name"`
	SectionId int      `json:"sectionId"`
	Position  Position `json:"position"`
	Features  Features `json:"features"`
}

type Place struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	SectionId   int      `json:"sectionId"`
	Description string   `json:"description"`
	Position    Position `json:"position"`
}

func Maps() ([]Map, error) {
	rows, err := config.DB.Query(`SELECT id, name FROM maps`)
	if err != nil {
		return nil, err
	}

	maps := []Map{}
	for rows.Next() {
		m := Map{}
		rows.Scan(&m.Id, &m.Name)
		maps = append(maps, m)
	}

	return maps, nil
}

func Sections() ([]Section, error) {
	rows, err := config.DB.Query(`SELECT id, name, xpos, ypos, width, height FROM sections`)
	if err != nil {
		return nil, err
	}

	sections := []Section{}
	for rows.Next() {
		s := Section{}
		rows.Scan(&s.Id, &s.Name, &s.Position.X, &s.Position.Y, &s.Position.W, &s.Position.H)
		sections = append(sections, s)
	}

	return sections, nil
}

func Users() ([]User, error) {
	rows, err := config.DB.Query(`SELECT id, name, desk_id, email, thumbnail FROM users`)
	if err != nil {
		return nil, err
	}

	users := []User{}
	for rows.Next() {
		u := User{}
		rows.Scan(&u.Id, &u.Name, &u.DeskId, &u.Email, &u.ThumbnailUrl)
		users = append(users, u)
	}

	return users, nil
}

func Rooms() ([]Room, error) {
	rows, err := config.DB.Query(`SELECT id, name, section_id, xpos, ypos, width, height, chromecast, phone, tv,
 seats FROM rooms`)
	if err != nil {
		return nil, err
	}

	rooms := []Room{}
	for rows.Next() {
		r := Room{}
		rows.Scan(&r.Id, &r.Name, &r.SectionId, &r.Position.X, &r.Position.Y, &r.Position.W, &r.Position.H, &r.Features.Chromecast, &r.Features.Phone, &r.Features.Tv, &r.Features.Seats)
		rooms = append(rooms, r)
	}

	return rooms, nil
}

func Places() ([]Place, error) {
	rows, err := config.DB.Query(`SELECT id, name, section_id, description, xpos, ypos, width, height FROM places`)
	if err != nil {
		return nil, err
	}

	places := []Place{}
	for rows.Next() {
		p := Place{}
		rows.Scan(&p.Id, &p.Name, &p.SectionId, &p.Description, &p.Position.X, &p.Position.Y, &p.Position.W, &p.Position.H)
		places = append(places, p)
	}

	return places, nil
}
