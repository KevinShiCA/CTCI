package structures_test

import "testing"

func testError(err error, t *testing.T) {
	if err != nil {
		t.Error(err)
	}
}
