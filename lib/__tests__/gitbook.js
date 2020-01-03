var gbook = require('../gbook');

describe('satisfies', function() {

    it('should return true for *', function() {
        expect(gbook.satisfies('*')).toBe(true);
    });

});
