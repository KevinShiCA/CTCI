package questions_test

import (
	"reflect"
	"testing"
)

func testInt(result int, expected int, t *testing.T) {
	if result != expected {
		t.Errorf("Expected %d, got %d", expected, result)
	}
}

func testBoolean(result bool, expected bool, t *testing.T) {
	if result != expected {
		t.Errorf("Expected %t, got %t", expected, result)
	}
}

func testString(result string, expected string, t *testing.T) {
	if result != expected {
		t.Error("Expected " + expected + ", got " + result)
	}
}

func testArray(result interface{}, expected interface{}, t *testing.T) {
	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected %v, got %v", expected, result)
	}
}

func testNil(result interface{}, t *testing.T) {
	if result != nil {
		t.Errorf("Expected nil, got %v", result)
	}
}

func testNoError(err error, t *testing.T) {
	if err != nil {
		t.Error(err)
	}
}

func testErrorExists(err error, message string, t *testing.T) {
	if err == nil {
		t.Error("Expected error: " + message)
	}
}
