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
<template>
  <div class="p-5">
    <Pick :version="version" :versionDate="versionDate" :testing="false" />
  </div>
</template>

<script>
import Pick from "./components/Pick.vue";

export default {
  name: "App",
  components: {
    Pick
  },
  data() {
    return {
      //App version and release date
      version: "v1.1",
      versionDate: "17.10.2021"
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
