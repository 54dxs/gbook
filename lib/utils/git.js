var is = require('is');
var path = require('path');
var crc = require('crc');
var URI = require('urijs');

var pathUtil = require('./path');
var Promise = require('./promise');
var command = require('./command');
var fs = require('./fs');

var GIT_PREFIX = 'git+';

function Git() {
    this.tmpDir;
    this.cloned = {};
}

// 返回一个唯一ID(由 host/ref 组合)
Git.prototype.repoID = function(host, ref) {
    return crc.crc32(host+'#'+(ref || '')).toString(16);
};

// 分配一个临时文件夹用于克隆其中的repo
Git.prototype.allocateDir = function() {
    var that = this;

    if (this.tmpDir) return Promise();

    return fs.tmpDir()
    .then(function(dir) {
        that.tmpDir = dir;
    });
};

// 克隆一个Git存储库，如果不需要的话
Git.prototype.clone = function(host, ref) {
    var that = this;

    return this.allocateDir()

    // 返回或克隆git repo
    .then(function() {
        // repo/ref 组合的唯一ID
        var repoId = that.repoID(host, ref);

        // 文件夹的绝对路径
        var repoPath = path.join(that.tmpDir, repoId);

        if (that.cloned[repoId]) return repoPath;

        // 克隆 repo
        return command.exec('git clone '+host+' '+repoPath)

        // 如果指定了,则将该reference检验(Checkout)
        .then(function() {
            that.cloned[repoId] = true;

            if (!ref) return;
            return command.exec('git checkout '+ref, { cwd: repoPath });
        })
        .thenResolve(repoPath);
    });
};

// 从git repo获取文件
Git.prototype.resolve = function(giturl) {
    // git repo中文件的路径?
    if (!Git.isUrl(giturl)) {
        if (this.resolveRoot(giturl)) return Promise(giturl);
        return Promise(null);
    }
    if (is.string(giturl)) giturl = Git.parseUrl(giturl);
    if (!giturl) return Promise(null);

    // 克隆或从缓存获取
    return this.clone(giturl.host, giturl.ref)
    .then(function(repo) {
        return path.resolve(repo, giturl.filepath);
    });
};

// 从文件路径返回git repo的根目录
Git.prototype.resolveRoot = function(filepath) {
    var relativeToGit, repoId;

    // 没有克隆git repo，或者文件不在git存储库中
    if (!this.tmpDir || !pathUtil.isInRoot(this.tmpDir, filepath)) return null;

    // 提取第一个目录（是repo id）
    relativeToGit = path.relative(this.tmpDir, filepath);
    repoId = relativeToGit.split(path.sep)[0];
    if (!repoId) {
        return;
    }

    // 返回绝对文件
    return path.resolve(this.tmpDir, repoId);
};

// 检查url是否为git依赖项url
Git.isUrl = function(giturl) {
    return (giturl.indexOf(GIT_PREFIX) === 0);
};

// 分析和提取信息
Git.parseUrl = function(giturl) {
    var ref, uri, fileParts, filepath;

    if (!Git.isUrl(giturl)) return null;
    giturl = giturl.slice(GIT_PREFIX.length);

    uri = new URI(giturl);
    ref = uri.fragment() || null;
    uri.fragment(null);

    // 在repo中提取文件（在.git之后）
    fileParts = uri.path().split('.git');
    filepath = fileParts.length > 1? fileParts.slice(1).join('.git') : '';
    if (filepath[0] == '/') {
        filepath = filepath.slice(1);
    }

    // 重新创建没有真实文件名的路径名
    uri.path(fileParts[0] + '.git');

    return {
        host: uri.toString(),
        ref: ref,
        filepath: filepath
    };
};

module.exports = Git;
