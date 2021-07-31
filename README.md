<!--
    PickThem - Random members picker, to define the people responsible for things to do in a collective, over a given period and activities.
    Copyright (C) 2021 Samuel Roland

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
# PickThem
### Random members picker, to define the people responsible for things to do in a collective, over a given period and activities. Built with Tailwindcss and VueJS. The texts are written in French...

Français: `Choix aléatoire de membres, pour définir les responsables des choses à faire dans un collectif, sur une période et des activités données.`

<kbd><img src="https://user-images.githubusercontent.com/78803322/127714305-19ddabc6-3f3e-4ffa-be14-06578e17722c.png" border="5px red solid"/></kbd>

## How to use
The app is designed to attribute randomly some tasks during one week to members of the collective (without distinction) and to.  
It's not totally random because, here is the algorithm: for each cell of the array, choose a member in the list of not assigned members (to prevent a member to be attributed 2 times if they are enough members), and if the list of not assigned members is empty, then the list is reloaded with the total list of users to make a second round of attributions, etc.

### Download
Download the latest version under [Releases](https://github.com/samuelroland/PickThem/releases), unzip the file and open the `index.html` app. The app is only this file, all is locally in the browser (everything is deleted at page refresh), and it's totally offline.

### Use
1. Choose a number of weeks to generate
1. Fill the tasks list activities (one per line, empty lines are ignored)
1. Fill the members list (one per line, empty lines are ignored)
1. Choose how much weeks do you want per activity
1. Click on `Go`, the results will appear (click on `Go` again if needed)
1. You can now save the attributions somewhere else (for example in a excel sheet). The selection can be made on the name only (to avoid selecting first line and left column).

## Development
### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Credits
- TailwindCSS - [MIT](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE)  
Copyright (c) Adam Wathan <adam.wathan@gmail.com>  
Copyright (c) Jonathan Reinink <jonathan@reinink.ca>  
- VueJS - [MIT](https://github.com/vuejs/vue/blob/dev/LICENSE)  
Copyright (c) 2013-present, Yuxi (Evan) You
