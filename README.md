<p align="center">
	<img alt="Brain Logo" src="./img/linguist-unknown.png" width="100" />
</p>

<p align="center">
<a href="#"><img alt="Open Source" src="https://badges.frapsoft.com/os/v2/open-source.svg?v=103" /></a>
<a href="https://travis-ci.org/github-aux/linguist-unknown"><img alt="Travis" src="https://travis-ci.org/github-aux/linguist-unknown.svg" /></a>
<a href="#"><img alt="Badges" src="https://david-dm.org/boennemann/badges/status.svg" /></a>
<a href="#"><img alt="GPL" src="https://badges.frapsoft.com/os/gpl/gpl.png?v=103" /></a>
</p>

# Linguist Unknown
> This repository is used as a Web Browser extension for the website GitHub.com in order to detect and highlight unknown, lost or new programming languages.

See  [`CONTRIBUTING.md`](CONTRIBUTING.md) before creating a pull request.

# <img src="https://github.com/brain-labs/brainstation/blob/master/img/table_of_contents.png" alt="table of contents">

- [Why](#why-should-you-download-it)
- [Download](#how-can-i-download-and-use-it)
- [Check if Linguist Unknown works](#how-do-i-know-if-it-works)
  - [Check if your yaml is valid](#how-do-i-know-my-yaml-is-valid)
- [Highlighting a new language](#how-to-highlight-my-languages)
- [Examples](#examples)
- [Documentation](#documentation)
    - [Multiple Languages](#multiple-languages-in-same-repo)
    - [extensions](#extensions)
    - [default](#default)
      - [color](#defaultcolor)
    - [identifier](#identifier)
      - [color](#identifiercolor)
    - [number](#number)
      - [color](#numbercolor)
    - [string](#string)
      - [color](#stringcolor)
    - [comment](#comment)
      - [color](#commentcolor)
      - [single_line](#commentsingle_line)
      - [begin_multiline](#commentbegin_multiline)
      - [end_multiline](#commentend_multiline)
    - [group](#group)
      - [color](#groupcolor)
      - [keywords](#groupkeywords)
      - [operators](#groupoperators)
      - [regexes](#groupregexes)
- [Contributing](#contributing)
- [License](#license)

### Why should you download it?
There are numerous cool languages out there whose syntaxes are not being highlighted on `GitHub`. That happens because the [Linguist Project](https://github.com/github/linguist) targets only the main existent programming languages.

Because of that, most of the time it is frustrating to see a new-or-unknown-language source code. `Linguist Unknown` is a project that helps new, lost or unknown languages to be visualized on GitHub. It helps you to do what you already do on your favorite Text Editor.

We believe that all languages should be highlighted on GitHub; just the way it should always be. :) There is an ocean of programming languages out there and by downloading `Linguist Unknown` you're making every drop of this ocean count!

### How can I download and use it?
__Two Simple Steps__:
- Install the [Google Chrome Plugin](https://chrome.google.com/webstore/detail/linguist-unknown/oohlobhfikieeeldgalkkkaojcaebclk) or the Firefox Plugin (still in __TODO__, [accepting pull requests](CONTRIBUTING.md)).
- Make sure it is active.

<img alt="On/Off" src="./img/on_off.gif" />

### How do I know if it works?
After [downloading and installing it](#how-can-i-download-and-use-it), visit one (or all) of the link(s):
- [./examples/C/io.c](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/C/io.c)
- [./examples/Brain/human_jump.brain](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain)
- [./examples/Brainfuck/hellbox.bf](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brainfuck/hellbox.bf)
- [./examples/Test/test.test](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Test/test.test)

__If__ they're `highlighted`, you're good to go!

#### How do I know my YAML is valid?
Please read the [documentation](#documentation) and check if your YAML is valid  [here](https://nodeca.github.io/js-yaml/)

### How to highlight my language(s)?
1. [Download](#how-can-i-download-and-use-it) and install `Linguist Unknown`.
2. Add a file named `.linguist.yml` into the root of your GitHub repository to tell `Linguist Unknown` your language(s) grammar(s).
3. Write your grammar(s) rules. The example below tells `Linguist Unknown` that you have a programming language called `Foo` whose extensions are `.foo` and `.bar`. It also tells that `Foo`'s single linge comment is defined by `//`, whereas its multiline comments are defined by `/*` and `*/`. Last but not least, it defines the color of your tokens i.e. __identifier.color__, __number.color__. It also helps you to define the color groups of your grammar's `keywords`, `operators` and customizable `regexes`
```YAML
Foo:
  extensions:
    - ".foo"
    - ".bar"

  default:
    color: "#808A9F"

  identifier:
    color: "#333333"

  number:
    color: "#FF6600"

  string:
    color: "#333300"

  comment:
    color: "#CCF5AC"
    single_line: "//"
    begin_multiline: "/*"
    end_multiline: "*/"

  group:
    - color: "#72EEBB"
      operators:
        - "==="
        - ">="
      keywords:
        - "int"
        - "float"
      regexes:
        - regex: "&(amp;)\/[^\/]*\/([\\S]?)*"
          modifier: ""

    - color: "#FF00FF"
      keywords:
        - "if"
        - "else"
        - "switch"
        - "let"
```
4. Test it. Go to `/path/to/file.foo` or `/path/to/file.bar` and check if is highlighted! Simple as that!

### Examples

##### Brain Language

```YAML
Brain:
  extensions:
    - ".br"
    - ".brain"

  default:
    color: "#969896"

  group:
    - color: "#a71d5d"
      operators:
        - ">"
        - "<"
        - "^"
        - "&lt;"
        - "&gt;"

    - color: "#333333"
      operators:
        - "["
        - "]"
        - "{"
        - "}"
        - "?"
        - ":"
        - ";"
        - "!"

    - color: "#0086b3"
      operators:
        - "+"
        - "-"
        - "*"
        - "/"
        - "%"
        - "_"

    - color: "#795da3"
      operators:
        - "."
        - ","
        - "$"
        - "#"

```

###### Output

<p>
<img alt="Brain" src="./img/brain_change.gif" />
</p>

##### Test

```YAML
Test:
  extensions:
    - ".test"

  default:
    color: "#FF8272"

  identifier:
    color: "#FF99FF"

  number:
    color: "#FF6600"

  string:
    color: "#333300"
  
  comment:
    color: "#969896"
    single_line: "//"
    begin_multiline: "/*"
    end_multiline: "*/"

  group:
    - color: "#72EEBB"
      keywords:
        - "for"
        - "while"
      regexes:
        - regex: "&(amp;)\/[^\/]*\/([\\S]?)*"
          modifier: ""

    - color: "#FF00FF"
      keywords:
        - "if"
        - "else"
        - "switch"
        - "let"
```

##### Output

<p>
<img alt="Test" src="./img/changing_test.gif" width="450px"/>
</p>


### Documentation

##### Multiple languages in same repo
It's simple, in your `.linguist.yml`:
```YAML
Foo:
  extensions:
    - ".foo"
  # ... other rules

Bar:
  extensions:
    - ".bar"
  # ... other rules
```

##### extensions
List of extensions for your language.
```YAML
extensions:
  - ".ext1"
  - ".ext2"
```

##### default
The default configurations for your language.

###### default.color
All tokens with `undefined` color will have this color. If this color is not defined, it will use `GitHub`'s default color: `#24292e`.
```YAML
default:
  color: "#F00BAF"
```

##### identifier
The rules for `identifiers` in your language.
_// Obs.: Right now we only have the property color, but we may add other properties later such as custom identifiers._

###### identifier.color
The color for your language's `identifiers`. If this color is `undefined`, it will user the property `default.color` instead.
```YAML
identifier:
  color: "#F00BAF"
```

##### number
The rules for `numbers` in your language.
_// Obs.: Right now we only have the property color, but we may add other properties later such as custom numbers._

###### number.color
The color for your language's `numbers`. If this color is `undefined`, it will user the property `default.color` instead.
```YAML
number:
  color: "#F00BAF"
```

##### string
The rules for `strings` in your language.
_// Obs.: Right now we only have the property color, but we may add other properties later such as custom strings._

###### string.color
The color for your language's `strings`. If this color is `undefined`, it will user the property `default.color` instead.
```YAML
string:
  color: "#F00BAF"
```
#### comment
Group of __lexemes__ related to your comment tokens.

##### comment.color
The color for your language's `comments`. If this color is `undefined`, it will user the property `default.color` instead.
```YAML
comment:
  color: "#F00BAF"
  ...
```

##### single\_line
The __lexeme__ for your single line comments, such as `//`, `#` and others
```YAML
comment:
  single_line: "//"
  ...
```

##### begin\_multiline
The __lexeme__ for the begin of your multiline comments, such as `/*`, `{` and others
```YAML
comment:
  begin_multiline: "/*"
  ...
```

##### end\_multiline
The __lexeme__ for the end of your multiline comments, such as `*/`, `}` and others
```YAML
comment:
  end_multiline: "*/"
```

##### group
Represents a list of color rules for your `keywords`, `operators` and others. Example
```YAML
group:
  - color: "#F00BAF"
    keywords:
      - "if"
      - "while"
      - "for"
  - color: "#333333"
    keywords:
      - "int"
      - "float"
    operators:
      - "==="
      - "!=="
      - "=="
  - color: "FF0000"
    regexes:
      - regex: "&(amp;)\/[^\/]*\/([\\S]?)*"
        modifier: ""
      - regex: "^#(?:[0-9a-fA-F]{3}){1,2}"
        modifier: "i"
```

###### group.color
Defines the `color group` for your `keywords`, `operators` and others (such as `regexes`). If `undefined`, it will user the property default.color instead.
```YAML
group:
  - color: "#F00BAF"
```

###### group.keywords
Defines a list of `keywords` for a color group.
```YAML
group:
  - color: "#F00BAF"
    keywords:
      - "if"
      - "else"
```

###### operators
Defines a list of `operators` for color group.
```YAML
group:
  - color: "#F00BAF"
    operators:
      - "=="
      - "!="
      - ">"
```

###### regexes
Defines a list of `regexes` for a color group. The `regexes` properties can be used as a property that may identify custom `lexemes` not included by `Linguist Unknown`. For example, imagine that `#FFFFFF` is a valid lexeme in your language, to highlight it with red color, you would most likely do:
```YAML
group:
  - color: "#FF0000"
    regexes:
      - regex: "^#(?:[0-9a-fA-F]{3}){1,2}"
        modifiers: ""
```

### Contributing
Feel free to send your pull requests. Read our [CONTRIBUTING.md](CONTRIBUTING.md) file :)

### LICENSE
This project extends [GNU GPL v. 3](http://www.gnu.org/licenses/gpl-3.0.en.html), so be aware of that, regarding copying, modifying and (re)destributing.
