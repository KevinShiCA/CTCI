package questions_test

import (
	"reflect"
	"testing"
)

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
