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
  <div class="flex">
    <div class="text-green-700 w-12 flex-1 flex items-end">
      <h1 class="text-3xl inline">PickThem</h1>
      <span class="text-sm ml-1 italic" title="Publié le 31.07.2021."
        >v1.0</span
      >
    </div>
    <div>
      <div
        class="w-12 h-12 ml-3 border-2 border-green-800 bg-green-200 text-center flex items-center justify-center text-3xl rounded text-green-700"
      >
        PT
      </div>
    </div>
  </div>
  <div class="text-gray-600 italic">
    <h4
      title="Random members picker, to define the people responsible for things to do in a collective, over a given period and activities."
      class="font-bold mt-1"
    >
      Choix aléatoire de membres, pour définir les responsables des choses à
      faire dans un collectif, sur une période et des activités données.
    </h4>
    <div>
      <span class="not-italic">Voir le </span>
      <a
        href="https://github.com/samuelroland/PickThem/blob/main/HOWTOUSE.md#comment-utiliser"
        target="_blank"
        class="not-italic"
        >manuel d'utilisation.</a
      >
    </div>
    <span class="text-xs">
      Réalisé par
      <a href="https://github.com/samuelroland" target="_blank"
        >Samuel Roland</a
      >
      - Publié sous licence libre
      <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank"
        >GNU AGPLv3</a
      >
      - Lien
      <a href="https://github.com/samuelroland/PickThem" target="_blank"
        >code source</a
      >.
    </span>
  </div>
  <hr />

  <div>
    <div class="font-bold text-xl mt-1">Configuration</div>
    <div class="">
      <div>
        Nombre de semaines
        <span class="text-sm">(pour la plage à générer)</span>:
        <input class="w-12" type="number" min="1" v-model="nbWeeks" />
      </div>
    </div>
    <div class="">
      <div class="w-full">
        <div class="text-sm">
          {{ activities.length }} activité{{
            activities.length > 1 ? "s" : ""
          }}
          détectée{{ activities.length > 1 ? "s" : "" }}.
        </div>
        <textarea
          class="w-full max-w-2xl"
          v-model="activitiesRaw"
          rows="4"
          placeholder="Liste d'activités: Rentrez une activité par ligne."
          @keyup="loadActivities"
        ></textarea>
      </div>

      <div class="w-full">
        <div class="text-sm">
          {{ members.length }} membre{{
            members.length > 1 ? "s" : ""
          }}
          détecté·e{{ members.length > 1 ? "s" : "" }}.
          <input
            type="checkbox"
            v-model="priorityMode"
            id="priorityMode"
            class="ml-4"
            @change="loadMembers"
          /><label for="priorityMode" class="ml-1">Mode priorité.</label>
          <span v-if="priorityMode" class="ml-1">
            {{
              members.filter(user => {
                return user.priority;
              }).length
            }}
            membres en priorité.</span
          >
        </div>
        <textarea
          class="w-full max-w-2xl"
          v-model="membersRaw"
          rows="8"
          placeholder="Liste de membres: Rentrez un·e membre par ligne."
          @keyup="loadMembers"
          @change="loadMembers"
        ></textarea>
      </div>
    </div>

    <div class="w-full justify-center">
      <div class="my-1 flex items-center">
        <div class="font-bold text-xl">Génération aléatoire</div>
        <button class="ml-2" @click="generate">Générer</button>
        <button class="ml-2" @click="emptyGeneration">Vider</button>
      </div>
      <div class="flex mb-3">
        <table class=" border-blue-300 border border-solid ">
          <thead>
            <tr>
              <th class="cell h-5">
                <div class="invisible">
                  <span class="text-sm">----</span><br />
                  <span class="text-xs">
                    <input type="text" class="w-10 h-4 ml-1 text-xs mr-1"
                  /></span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in nbWeeksInInt" :key="week">
              <td class="cell">Sem. {{ week }}</td>
            </tr>
          </tbody>
        </table>

        <table class="border-blue-300 border border-solid">
          <thead>
            <tr>
              <th
                class="cell"
                v-for="activity in activities"
                :key="activity.name"
              >
                <span class="text-sm">{{ activity.name }}</span
                ><br />
                <span class="text-xs">
                  <input
                    type="number"
                    class="w-10 h-4 ml-1 text-xs mr-1"
                    :max="nbWeeks"
                    min="1"
                    v-model="activity.number"
                  />fois</span
                >
              </th>
              <th v-if="activities.length == 0">Pas d'activités...</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in nbWeeksInInt" :key="week">
              <td class="cell" v-for="cell in cells[week]" :key="cell.id">
                <span
                  v-if="displayCellOrNot(cell.week_number, cell.activity_index)"
                  class="text-sm"
                >
                  {{ cell.member != null ? getNameOfMember(cell.member) : "-" }}
                </span>
                <span v-else>--</span>
                <span class="text-xs" hidden>
                  {{ cell.id }} {{ cell.activity_name }}
                  {{ cell.activity_index }} u:{{ cell.member }}
                  {{ cell.week_number }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="generated" hidden>
        <div class="ml-1">
          <div class="text-lg">Résultats</div>
          <span>{{ assignedMembers.length }} assigné·es</span>
          - <span>{{ membersNotAssigned.length }} non assigné·es</span>
          <div class="font-bold mt-2">Membres non assigné·es:</div>
          <div class="flex justify-center flex-wrap">
            <div class="ml-1" v-for="id in membersNotAssigned" :key="id">
              {{ id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pick",
  data() {
    return {
      priorityMode: false,
      generated: false,
      nbWeeks: 6,
      activitiesRaw: "",
      cells: [],
      activities: [],
      assignedMembers: [],
      members: [],
      membersRaw: ""
    };
  },
  computed: {
    nbMembers() {
      return this.members.length;
    },
    nbWeeksInInt() {
      return parseInt(this.nbWeeks);
    },
    membersNotAssigned() {
      var array = [];
      for (var i = 1; i <= this.nbMembers; i++) {
        if (this.assignedMembers.includes(i) == false) {
          array.push(i);
        }
      }
      return array;
    }
  },
  methods: {
    getNameOfMember(id) {
      var member = this.members.find(member => {
        return member.id == id;
      });
      if (member != null) {
        return member.name;
      } else {
        return "??";
      }
    },
    generate() {
      if (this.members.length != 0 && this.activities.length != 0) {
        this.assignedMembers = [];
        for (var i = 1; i <= this.nbWeeks; i++) {
          this.cells[i].forEach((cell, weekIndex) => {
            console.log("heyooo");
            console.log(cell);
            console.log(this.cells[i][weekIndex]);

            cell.member = this.getRandomNotAssignedMember();
            this.cells[i][weekIndex] = cell;
          });
        }
        this.generated = true;
      }
    },
    emptyGeneration() {
      if (
        this.generated == true &&
        confirm("Souhaitez-vous vraiment vider les résultats générés ?")
      ) {
        this.initCells();
        this.generated = false;
      }
    },
    displayCellOrNot(weeknumber, activityindex) {
      if (this.activities[activityindex] != null) {
        return weeknumber <= this.activities[activityindex].number;
      } else {
        return false;
      }
      //cell.week_number <= activities[cell.activity_index].number
    },
    getRandomNotAssignedMember() {
      var randomInt = -1;
      do {
        //if all users have been attributed, put the list to zero to allow second round of attributions
        if (this.membersNotAssigned.length == 0) {
          this.assignedMembers = [];
        }
        randomInt = Math.round(Math.random() * this.nbMembers) + 1;
        if (randomInt > this.nbMembers) {
          randomInt = this.nbMembers;
        }
      } while (this.assignedMembers.includes(randomInt));
      this.assignedMembers.push(randomInt);
      return randomInt;
    },
    loadMembers() {
      var counter = 0;
      var array = this.membersRaw.split("\n").filter(val => {
        return val.trim() != "";
      });
      this.members = [];
      console.log(this.members);
      for (var name of array) {
        counter++;
        this.members.push({
          id: counter,
          name: this.priorityMode
            ? name
                .trim()
                .substring(
                  0,
                  name.trim().indexOf("\t") != -1
                    ? name.trim().indexOf("\t")
                    : name.trim().length
                )
            : name,
          //If priority mode enabled, set priority if last char is P, or set null.
          priority: this.priorityMode
            ? name.trim().charAt(name.trim().length - 1) == "P"
            : null
        });
      }
    },
    loadActivities() {
      var array = this.activitiesRaw.split("\n").filter(val => {
        return val.trim() != "";
      });
      this.activities = [];
      console.log(this.activities);
      for (var activityName of array) {
        this.activities.push({
          name: activityName,
          number:
            this.activities.find(item => {
              return item.name == activityName;
            }) != undefined
              ? this.activities.find(item => {
                  return item.name == activityName;
                }).number
              : this.nbWeeksInInt
        });
      }
      this.initCells();
    },
    initCells() {
      var counter = 0;
      var obj = {};
      for (var i = 1; i <= this.nbWeeks; i++) {
        var weekCollection = [];
        for (var j = 1; j <= this.activities.length; j++) {
          counter++;
          var cell = {
            id: counter,
            member: null,
            activity_index: j - 1,
            activity_name: this.activities[j - 1].name,
            week_number: i
          };
          weekCollection.push(cell);
        }
        obj[i] = weekCollection;
      }
      this.cells = obj;
    }
  },
  mounted() {
    this.loadActivities();
    this.initCells();
  }
};
</script>
