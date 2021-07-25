package db

import (
	"encoding/json"
	"errors"
	"log"

	badger "github.com/dgraph-io/badger/v3"
)

type DB interface {
	Get(table string, id string, v interface{}) error
	Exists(table string, id string) (bool, error)
	Update(table string, id string, v interface{}) error
	Create(table string, id string, v interface{}) error
	Close() error
}

type BadgerDBImpl struct {
	uDB *badger.DB
}

func CreateLocalDB() DB {
	db, err := badger.Open(badger.DefaultOptions("/tmp/badger"))
	if err != nil {
		log.Fatal(err)
	}
	return &BadgerDBImpl{db}
}
func key(table string, id string) []byte {
	return []byte(table + "/" + id)
}

func (db *BadgerDBImpl) Get(table string, id string, result interface{}) error {
	return db.uDB.View(func(txn *badger.Txn) error {
		item, err := txn.Get(key(table, id))
		if err != nil {
			return err
		}
		return item.Value(func(val []byte) error {
			return json.Unmarshal(val, &result)
		})
	})
}

func (db *BadgerDBImpl) Exists(table string, id string) (bool, error) {
	err := db.uDB.View(func(txn *badger.Txn) error {
		_, err := txn.Get(key(table, id))
		return err
	})
	if err == nil {
		return true, nil
	} else if err == badger.ErrKeyNotFound {
		return false, nil
	} else {
		return false, err
	}
}

func (db *BadgerDBImpl) Update(table string, id string, newValue interface{}) error {
	return db.uDB.Update(func(txn *badger.Txn) error {
		json, err := json.Marshal(newValue)
		if err != nil {
			return err
		}
		e := badger.NewEntry(key(table, id), json)
		return txn.SetEntry(e)
	})
}

func (db *BadgerDBImpl) Create(table string, id string, newValue interface{}) error {
	exists, err := db.Exists(table, id)
	if exists {
		return errors.New("Duplicated key:" + id)
	}
	if err != nil {
		return err
	}
	return db.Update(table, id, newValue)
}

func (db *BadgerDBImpl) Close() error {
	return db.uDB.Close()
}
