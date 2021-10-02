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
    <div class="flex items-end flex-1 w-12 text-green-700">
      <h1 class="inline text-3xl">PickThem</h1>
      <span class="ml-1 text-sm italic" title="Publié le 31.07.2021."
        >v1.0</span
      >
    </div>
    <div>
      <div
        class="flex items-center justify-center w-12 h-12 ml-3 text-3xl text-center text-green-700 bg-green-200 border-2 border-green-800 rounded"
      >
        PT
      </div>
    </div>
  </div>
  <div class="italic text-gray-600">
    <h4
      title="Random members picker, to define the people responsible for things to do in a collective, over a given period and activities."
      class="mt-1 font-bold"
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
    <div class="mt-1 text-xl font-bold">Configuration</div>
    <div class="">
      <div>
        Nombre de semaines
        <span class="text-sm">(pour la plage à générer)</span>:
        <input
          @change="initCells"
          class="w-12"
          type="number"
          min="1"
          v-model="nbWeeks"
        />
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

    <div class="justify-center w-full">
      <div class="flex items-center my-1">
        <div class="text-xl font-bold">Génération aléatoire</div>
        <button class="ml-2" @click="generate">Générer</button>
        <button class="ml-2" @click="emptyGeneration">Vider</button>
      </div>
      <div class="flex mb-3">
        <table class="border border-blue-300 border-solid ">
          <thead>
            <tr>
              <th class="h-5 cell">
                <div class="invisible">
                  <span class="text-sm">----</span><br />
                  <span class="text-xs">
                    <input type="text" class="w-10 h-4 ml-1 mr-1 text-xs"
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

        <table class="border border-blue-300 border-solid">
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
                    class="w-10 h-4 ml-1 mr-1 text-xs"
                    :max="nbWeeks"
                    min="1"
                    @change="initCells"
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
                <span>toassign: {{ cell.toassign ? 1 : 0 }}</span>
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
      <div v-if="generated">
        <div class="ml-1">
          <div class="text-lg">Résultats</div>
          <span>{{ assignedMembers.length }} assigné·es</span>
          - <span>{{ membersNotAssigned.length }} non assigné·es</span>
          <div class="mt-2 font-bold">Membres non assigné·es:</div>
          <div class="flex flex-wrap justify-center">
            <div class="ml-1" v-for="id in membersNotAssigned" :key="id">
              {{ id }}
            </div>
          </div>
        </div>
        <div>
          <div class="text-lg">Résultats</div>
          <div>
            <ul v-if="false">
              <li
                v-for="assignationsForOneUser in assignationsByUser"
                :key="assignationsForOneUser"
              >
                {{
                  "userid:" + assignationsForOneUser ??
                    assignationsForOneUser[0].id
                }}
                -
                {{
                  this.members.find(member => {
                    return member.id == assignationsForOneUser[0].id ?? -1;
                  }) != null
                    ? this.members.find(member => {
                        return member.id == assignationsForOneUser[0].id;
                      }).name
                    : assignationsForOneUser[0].id
                }}
                - {{ assignationsForOneUser ?? assignationsForOneUser.length }}
              </li>
            </ul>
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
      nbWeeks: 2,
      activitiesRaw: "pain\nfromage\ntodo",
      cells: [],
      activities: [],
      assignedMembers: [],
      members: [],
      membersRaw: "Johndoe\nAlicia\nJack\nLion"
    };
  },
  computed: {
    assignationsByUser() {
      if (this.generated) {
        var assignations = [];

        console.log(this.arrayOfCells);

        for (var member of this.members) {
          console.log("member");
          console.log(member);
          console.log(assignations);
          console.log("member.id:" + member.id);
          //if (assignations[member.id] == undefined) {
          //  console.log(assignations);
          //
          //  assignations[member.id] = [];
          //}
          //console.log(JSON.parse(JSON.stringify(this.cells)));

          //Push all assignations of a user to the assignations array indexed by id
          assignations[member.id] = JSON.parse(
            JSON.stringify(
              this.arrayOfCells.filter(cell => {
                return cell.member == member.id;
              })
            )
          );

          console.log(
            JSON.parse(
              JSON.stringify(
                this.arrayOfCells.filter(cell => {
                  return cell.member == member.id;
                })
              )
            )
          );
          console.log(assignations);
        }
        return assignations;
      }
      return [];
    },
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
    },
    arrayOfCells() {
      var array = [];
      if (this.members.length > 0 && this.activities.length > 0)
        for (var cellByWeek in this.cells) {
          for (var cell of this.cells[cellByWeek]) {
            array.push(cell);
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
      var assignationCount = 0; //total number of assignations
      this.initCells();
      this.generated = false;

      //Generate only if members and activities list are not empty
      if (this.members.length != 0 && this.activities.length != 0) {
        this.assignedMembers = []; //Clear assigned members list defined at last generation
        console.log("generate()");

        //For each week (each line of the array)
        for (var weekId = 1; weekId <= this.nbWeeks; weekId++) {
          console.log("test cells i find");
          console.log(
            this.cells[weekId].find(cell => {
              return cell.member == null;
            })
          );

          //While some cells not assigned and should be assigned (toassign = true) exist for the week, assign users for these cells
          while (
            this.cells[weekId].find(cell => {
              return cell.member == null && cell.toassign == true;
            }) != undefined
          ) {
            console.log("while 281");

            var cell = null;
            var activityIndex = null;

            //In this week, find randomly a cell without any member
            do {
              //Cell is choosed depending on the activity, so generate a random int between 0 and (nb of activities -1)
              activityIndex = Math.round(
                Math.random() * (this.activities.length - 1)
              );
              console.log(activityIndex);
              console.log(this.cells[weekId]);
              cell = this.cells[weekId][activityIndex];
            } while (cell.member != null || cell.toassign != true); //and continue while no cell without member is found (will not cause infinite loop because parent)

            var wantedMemberPriority = null;
            if (this.priorityMode) {
              // In yet in priority member assignation because number of members in priority in higher than assignations count.
              wantedMemberPriority =
                this.members.filter(member => {
                  member.priority;
                }).length > assignationCount;
            }

            cell.member = this.getRandomNotAssignedMember(wantedMemberPriority);
            this.cells[weekId][activityIndex] = cell;
            assignationCount++;
          }
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
    getRandomNotAssignedMember(wantedMemberPriority = null) {
      var randomInt = -1;
      var a = false;
      do {
        //if all users have been attributed, put the list to zero to allow second round of attributions
        if (this.membersNotAssigned.length == 0) {
          this.assignedMembers = [];
        }
        randomInt = Math.round(Math.random() * this.nbMembers) + 1;
        if (randomInt > this.nbMembers) {
          randomInt = this.nbMembers;
        }

        var respectPriority =
          this.members[randomInt - 1].priority == wantedMemberPriority;
        console.log(respectPriority);
      } while (a);
      this.assignedMembers.push(randomInt);
      return randomInt;
    },
    //Load members from this.membersRaw (raw textual list) to this.members (array of members)
    loadMembers() {
      var counter = 0;
      var array = this.membersRaw.split("\n").filter(val => {
        return val.trim() != "";
      });
      this.members = [];
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

    //Load activities from this.activitiesRaw (raw textual list) to this.activities (array of activities)
    loadActivities() {
      var array = this.activitiesRaw.split("\n").filter(val => {
        return val.trim() != "";
      });
      this.activities = [];
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

    //Init this.cells with given activities and different numbers of week
    initCells() {
      var counter = 0; //Counter of created cell to assign id to cell
      var cells = {}; //Cells array under construction. The array is indexed by week number and then by activity index. (Be careful between difference with index and number !)

      //As first indexed by week, let's loop on the given number of weeks
      for (var i = 1; i <= this.nbWeeks; i++) {
        var weekCollection = []; //Create another array for this week

        //As secondly indexed by activity, loop through them
        for (var j = 1; j <= this.activities.length; j++) {
          counter++;

          //Finally define the cell fields
          var cell = {
            id: counter,
            member: null,
            activity_index: j - 1,
            activity_name: this.activities[j - 1].name, //field unused just for debug purpose
            week_number: i,
            toassign: i <= this.activities[j - 1].number //If the cell must be assigned to a member or not (a "cell to not assign" case happens only when activity.number is less than this.nbWeeks )
          };
          weekCollection.push(cell);
        }
        cells[i] = weekCollection;
      }
      this.cells = cells;
    }
  },
  mounted() {
    //When app is mounted, load members, activities and init cells (in case fields are already filled). Mostly during development but maybe in production too.
    this.loadActivities();
    this.loadMembers();
    this.initCells();
  }
};
</script>
