# 生成电子书和PDF

GBook可以生成一个网站，但也可以将内容输出为电子书（ePub、Mobi、PDF）。

```
# 生成PDF文件
$ gbook pdf ./ ./mybook.pdf

# 生成ePub文件
$ gbook epub ./ ./mybook.epub

# 生成Mobi文件
$ gbook mobi ./ ./mybook.mobi
```

### 安装ebook-convert

`ebook-convert`是生成电子书（epub，mobi，pdf）所必需的。

##### 苹果操作系统

下载[Calibre应用程序](https://calibre-ebook.com/download)。将`calibre.app`移动到“应用程序”文件夹后，创建指向ebook-convert工具的符号链接：

```
$ sudo ln -s ~/Applications/calibre.app/Contents/MacOS/ebook-convert /usr/bin
```

您可以用$PATH中的任何目录替换`/usr/bin`。

### 封面

所有电子书格式都使用封面。您可以自己提供一个插件，也可以使用[autocover plugin](https://gbook.54dxs.cn/plugin/autocover)生成一个。

要提供封面，请将**`cover.jpg`**文件放在书本的根目录下。添加**`cover_small.jpg`**将指定封面的较小版本。封面应该是一个**JPEG**文件。

好的封面应该遵循以下准则：

* `cover.jpg`的大小为1800x2360像素，`cover_small.jpg`的大小为200x262像素`
* 没有边界
* 清晰可见的书名
* 任何重要的文本都应该在小版本中可见