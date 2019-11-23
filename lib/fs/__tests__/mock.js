var createMockFS = require('../mock');

// describe 块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称("#indexOf()")，第二个参数是一个实际执行的函数。

// it 块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"should return -1 when the value is not present"），第二个参数是一个实际执行的函数。

// 测试脚本里面应该包括一个或多个describe块，每个describe块应该包括一个或多个it块。

// 当遇到异步函数时，就需要用到异步测试，只有done()函数执行完毕后，该测试用例才算完成

describe('MockFS', function() {
    var fs = createMockFS({
        'README.md': 'Hello World',
        'SUMMARY.md': '# Summary',
        'folder': {
            'test.md': 'Cool',
            'folder2': {
                'hello.md': 'Hello',
                'world.md': 'World'
            }
        }
    });

    describe('exists', function() {
        it('must return true for a file', function() {
            return fs.exists('README.md')
            .then(function(result) {
                expect(result).toBeTruthy();
            });
        });

        it('must return false for a non existing file', function() {
            return fs.exists('README_NOTEXISTS.md')
            .then(function(result) {
                expect(result).toBeFalsy();
            });
        });

        it('must return true for a directory', function() {
            return fs.exists('folder')
            .then(function(result) {
                expect(result).toBeTruthy();
            });
        });

        it('must return true for a deep file', function() {
            return fs.exists('folder/test.md')
            .then(function(result) {
                expect(result).toBeTruthy();
            });
        });

        it('must return true for a deep file (2)', function() {
            return fs.exists('folder/folder2/hello.md')
            .then(function(result) {
                expect(result).toBeTruthy();
            });
        });
    });

    describe('readAsString', function() {
        it('must return content for a file', function() {
            return fs.readAsString('README.md')
            .then(function(result) {
                expect(result).toBe('Hello World');
            });
        });

        it('must return content for a deep file', function() {
            return fs.readAsString('folder/test.md')
            .then(function(result) {
                expect(result).toBe('Cool');
            });
        });
    });

    describe('readDir', function() {
        it('must return content for a directory', function() {
            return fs.readDir('./')
            .then(function(files) {
                expect(files.size).toBe(3);
                expect(files.includes('README.md')).toBeTruthy();
                expect(files.includes('SUMMARY.md')).toBeTruthy();
                expect(files.includes('folder/')).toBeTruthy();
            });
        });
    });
});
