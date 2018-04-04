<p align="center">
	<img alt="Linguist Unknown" src="./img/linguist-unknown.png" width="100" />
</p>

<p align="center">
<a href="#"><img alt="Open Source" src="https://badges.frapsoft.com/os/v2/open-source.svg?v=103" /></a>
<a href="https://travis-ci.org/github-aux/linguist-unknown"><img alt="Travis" src="https://travis-ci.org/github-aux/linguist-unknown.svg" /></a>
<a href="#"><img alt="Badges" src="https://david-dm.org/boennemann/badges/status.svg" /></a>
<a href="#"><img alt="GPL" src="https://badges.frapsoft.com/os/gpl/gpl.png?v=103" /></a>
</p>

# Linguist Unknown
> This repository contains the source code of Linguist Unknown Web Browser extension, which extends and targets GitHub features by detecting and highlighting unknown, lost or new programming languages. With Linguist Unknown, you might as well overwrite syntax highlighting of known languages such as C, Javascript and many others.

Please read the file [`CONTRIBUTING.md`](CONTRIBUTING.md) before creating a pull request.

# <img src="https://github.com/brain-labs/brainstation/blob/master/img/table_of_contents.png" alt="table of contents">

- [Why](#why-should-you-download-it)
- [Download](#how-can-i-download-and-use-it)
- [Highlighting a new language](#how-to-highlight-my-languages)
- [Examples](#examples)
- [Check if Linguist Unknown works](#how-do-i-know-if-it-works)
  - [Check if your yaml is valid](#how-do-i-know-my-yaml-is-valid)
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
      - [multiline](#groupmultiline)
- [Contributing](#contributing)
- [License](#license)

### Why should you download Linguist Unknown?
There are numerous cool languages out there whose syntaxes are not being highlighted on `GitHub` as the [Linguist Project](https://github.com/github/linguist), the GitHub project for highlighting source codes in different languages, targets only the main existent programming languages.

Because of that, it is frustrating to see a new-or-unknown-language source code. `Linguist Unknown` is a project that ensures thats new, lost or unknown (programming or not) languages are visualized on GitHub. It does what you already do on your favorite Text Editor.

We believe that all languages should be highlighted on GitHub; the way it should always be. :) There is an ocean of programming languages out there and by downloading `Linguist Unknown` you are making every drop of this ocean count!

### How can I download and use Linguist Unknown?
__Two Simple Steps__:
- Install Linguist Unknown's [Google Chrome Plugin](https://chrome.google.com/webstore/detail/linguist-unknown/oohlobhfikieeeldgalkkkaojcaebclk) or the Firefox Plugin (still in __TODO__, [accepting pull requests](CONTRIBUTING.md)).
- Make sure it is active.

<img alt="On/Off" src="./img/on_off.gif" />

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

    - color: "#000000"
      multiline:
        - begin: "\"\"\""
          end:   "\"\"\""

```
4. Test it. Go to `https://github.com/your/repository/path/to/file.foo` or `https://github.com/your/repository/path/to/file.bar` and check if is highlighted! Simple as that!

_// Obs.: Make sure you refresh your browser's cached data._

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

### How do I know if it works?
After [downloading and installing it](#how-can-i-download-and-use-it), visit one (or all) of the cool languages we have gathered in this repository:

| Language      | GitHub (or info) Repository | URL to test | Test file written by |
| :-----------: | :-------------------------: | :---------- | :-------------- |
| AdvPL         | [AdvPL repo](https://github.com/nginformatica/prelude-advpl) | [./examples/AdvPL/JSONTest.prw](https://github.com/github-aux/linguist-unknown/blob/development/examples/AdvPL/JSONTest.prw) | [haskellcamargo](https://github.com/haskellcamargo) |
| Brain         | [Brain repo](https://github.com/brain-labs/brain) | [./examples/Brain/human_jump.brain](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brain/human_jump.brain) | [luizperes](https://github.com/luizperes) |
| Brainfuck     | [Brainfuck (Wikipedia)](https://en.wikipedia.org/wiki/Brainfuck) | [./examples/Brainfuck/hellbox.bf](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Brainfuck/hellbox.bf) | Robert de Bath |
| BrazukaScript | [BrazukaScript repo](https://github.com/brazuka-script/brazuka-script) | [./examples/BrazukaScript/wesley_safadao.bra](https://github.com/github-aux/linguist-unknown/blob/development/examples/BrazukaScript/wesley_safadao.bra) | [luizperes](https://github.com/luizperes) |
| C | [C (Wikipedia)](https://en.wikipedia.org/wiki/C_(programming_language)) | [./examples/C/io.c](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/C/io.c) | [luizperes](https://github.com/luizperes) |
| Capybara | [Capybara repo](https://github.com/capybara-language/compiler) | [./examples/Capybara/helloworld.capy](https://github.com/github-aux/linguist-unknown/blob/development/examples/Capybara/helloworld.capy) | [haskellcamargo](https://github.com/haskellcamargo) |
| Headache | [Headache repo](https://github.com/LucasMW/Headache) | [./examples/Headache/func.ha](https://github.com/github-aux/linguist-unknown/blob/development/examples/Headache/func.ha) | [LucasMW](https://github.com/LucasMW) |
| Monga    | [Monga repo](https://github.com/LucasMW/mongaComp) | [./examples/Monga/bf.monga](https://github.com/github-aux/linguist-unknown/blob/development/examples/Monga/bf.monga) | [LucasMW](https://github.com/LucasMW) |
| Moon     | [Moon repo](https://github.com/MaiaVictor/moon-lang) | [./examples/Moon/_examples_.moon](https://github.com/github-aux/linguist-unknown/blob/development/examples/Moon/_examples_.moon) | [MaiaVictor](https://github.com/MaiaVictor) |
| Quack    | [Quack repo](https://github.com/quack/quack) | [./examples/Quack/fn_stmt.qk](https://github.com/github-aux/linguist-unknown/blob/development/examples/Quack/fn_stmt.qk) | [luizperes](https://github.com/luizperes) |
| Siren    | [Siren repo](https://github.com/siren-lang) | [./examples/Siren/100-doors.siren](https://github.com/github-aux/linguist-unknown/blob/development/examples/Siren/100-doors.siren) | [robotlolita](https://github.com/robotlolita) |
| Test | -- | [./examples/Test/test.test](https://github.com/github-aux/linguist-unknown/blob/chrome/examples/Test/test.test) | [luizperes](https://github.com/luizperes) |

__If__ they're `highlighted`, you're good to go!

#### How do I know my YAML is valid?
Please read the [documentation](#documentation) and check if your YAML is valid  [here](https://nodeca.github.io/js-yaml/)

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
  # ... other rules
```

##### begin\_multiline
The __lexeme__ for the begin of your multiline comments, such as `/*`, `{` and others
```YAML
comment:
  begin_multiline: "/*"
  # ... other rules
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
    multiline:
      - begin: "<begin>"
      - end:   "</end>"
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

  # ... other rules
```

###### group.keywords
Defines a list of `keywords` for a color group.
```YAML
group:
  - color: "#F00BAF"
    keywords:
      - "if"
      - "else"

  # ... other rules
```

###### group.operators
Defines a list of `operators` for color group.
```YAML
group:
  - color: "#F00BAF"
    operators:
      - "=="
      - "!="
      - ">"

  # ... other rules
```

###### group.regexes
Defines a list of `regexes` for a color group. The `regexes` properties can be used as a property that may identify custom `lexemes` not included by `Linguist Unknown`. For example, imagine that `#FFFFFF` is a valid lexeme in your language, to highlight it with red color, you would most likely do:
```YAML
group:
  - color: "#FF0000"
    regexes:
      - regex: "^#(?:[0-9a-fA-F]{3}){1,2}"
        modifiers: ""

  # ... other rules
```

###### group.multiline
Defines a list of multiline `lexemes` for a color group. It is very useful when you have a lexeme that takes multiple lines (not intended to be used for comments).
```YAML
group:
  - color: "#FF00FF"
    multiline:
      - begin: "<table>"
        end:   "</table>"

   # ... other rules
```

### Contributing
Feel free to send your pull requests. Read our [CONTRIBUTING.md](CONTRIBUTING.md) file :)

### LICENSE
This project extends [GNU GPL v. 3](http://www.gnu.org/licenses/gpl-3.0.en.html), thus be aware of that, regarding copying, modifying and (re)destributing.
