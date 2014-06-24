# IBL - Библиотека независимых блоков

## Структура проекта
**blocks** - Содержит все блоки библиотеки. Блок состоит из трех технологий: css, js, template. У каждого блока есть support файл со списком браузеров к которых блок работает.

**vendors** - Здесь лежат все внешние библиотеки.

**project.blocks** - Это уровень переопределния библиотечных блоков и описания собственных

*IBL-core.js* - Ядро библиотеки

*config.js* - Файл настроек, где указывается какие блоки должны войти в конечную сборку, а также путь для выходного файла.

*Gruntfile.js* - Скрипт автоматической сборки.

## С чего начать
Необходимо запустить Gruntfile скрипт, который в фоне будет следить за изменением файлов проекта и пересобирать их на лету.
Для того чтобы добавить свой блок в проект необходимо создать директорию в project.blocks и добавить этот блок в config.js

# API
Блоки могут быть добалены и инициализированы на странице как при отрисовке автоматически, так и динамически.

##### Пример объявления блока на странице
Блок будет автоматически инициализирован после загрузки страницы

```<input class='input-numeric' data-params='{"placeholder": "Set number"}'/>```


##### Пример динамического добавления блока
В body добавится блок input-numeric с параметрами {placeholder: 'ii'}

```IBL.DOM.append(document.body, 'input-numeric', {placeholder: 'ii'});```


##### Пример инициализации блока на существущем DOM
В body добавится блок input-numeric с параметрами {placeholder: 'ii'}

```IBL.initBlock('input-numeric', document.getElementsByClassName('input')[0]);```

