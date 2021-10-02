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
      <h1 class="inline text-4xl">PickThem</h1>
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
    <div class="flex flex-wrap">
      <div class="flex-1 mt-1 text-xl font-bold">Configuration</div>
      <div class="flex items-end mt-1">
        <span class="not-italic"></span>
        <a
          href="https://github.com/samuelroland/PickThem/blob/main/HOWTOUSE.md#comment-utiliser"
          target="_blank"
          class="not-italic"
          >Manuel d'utilisation.</a
        >
      </div>
    </div>
    <div class="">
      <div>
        Nombre de semaines
        <span class="text-sm">(pour la plage à générer)</span>:
        <input
          @change="onNbWeeksChange"
          class="w-12"
          type="number"
          min="1"
          v-model="nbWeeks"
        />
      </div>
    </div>
    <div class="">
      <div class="w-full">
        <div>
          <div class="inline mt-1 text-lg font-bold">Liste des activités</div>
          <div class="inline ml-3 text-sm">
            {{ activities.length }} activité{{
              activities.length > 1 ? "s" : ""
            }}
            détectée{{ activities.length > 1 ? "s" : "" }}.
          </div>
        </div>
        <textarea
          class="w-full max-w-2xl"
          v-model="activitiesRaw"
          rows="4"
          placeholder="Liste d'activités: Rentrez une activité par ligne."
          @click="alertInputNotModifiableAfterGeneration"
          :class="{ 'bg-gray-300': generated }"
          :disabled="generated"
          @keyup="loadActivities"
        ></textarea>
      </div>

      <div class="w-full">
        <div class="text-sm">
          <div class="inline mt-1 text-lg font-bold">Liste des membres</div>
          <div class="inline ml-3">
            {{ members.length }} membre{{
              members.length > 1 ? "s" : ""
            }}
            détecté·e{{ members.length > 1 ? "s" : "" }}.
          </div>
          <input
            type="checkbox"
            v-model="priorityMode"
            id="priorityMode"
            class="ml-4"
            @change="loadMembers"
            @click="alertInputNotModifiableAfterGeneration"
            :class="{ 'bg-gray-300': generated }"
          /><label for="priorityMode" class="ml-1">Mode priorité.</label>
          <span v-if="priorityMode" class="ml-1">
            {{ countPriorityMembers() }}
            membre{{ countPriorityMembers() > 1 ? "s" : "" }} prioritaire{{
              countPriorityMembers() > 1 ? "s" : ""
            }}.</span
          >
        </div>
        <textarea
          class="w-full max-w-2xl"
          v-model="membersRaw"
          rows="8"
          placeholder="Liste de membres: Rentrez un·e membre par ligne."
          @keyup="loadMembers"
          @change="loadMembers"
          :class="{ 'bg-gray-300': generated }"
        ></textarea>
      </div>
    </div>

    <div class="justify-center w-full">
      <div class="flex items-center my-1">
        <div class="mr-3 text-xl font-bold">Génération aléatoire</div>
        <button
          class="ml-2 hover:bg-green-600 hover:text-gray-100"
          @click="generate"
        >
          Générer
        </button>
        <button class="ml-2 hover:bg-red-300" @click="emptyGeneration">
          Vider ...
        </button>
      </div>
      <div class="flex mb-3">
        <!-- First table at left containing empty header cell and weeks name cells. This table is separated from the second table to enable text selection of the generated values without week numbers -->
        <table class="">
          <thead>
            <tr>
              <th class="h-5 cell">
                <!-- Fake hidden content to take the same place than other th -->
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
              <td class="cell ">Sem. {{ week }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Second table with activities in headers and generated values below -->
        <table class="">
          <thead>
            <tr>
              <th
                class="overflow-hidden cell overflow-ellipsis"
                v-for="activity in activities"
                :key="activity.name"
              >
                <span
                  style=" display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;max-width: 15rem"
                  class="overflow-hidden text-sm overflow-ellipsis"
                  :title="activity.name"
                  >{{ activity.name }}</span
                >
                <span class="text-xs">
                  <input
                    type="number"
                    class="w-10 h-4 ml-1 mr-1 text-xs"
                    :max="nbWeeks"
                    min="1"
                    @change="initCells"
                    @click="alertInputNotModifiableAfterGeneration"
                    :readonly="generated"
                    :class="{ 'bg-gray-300': generated }"
                    v-model="activity.number"
                /></span>
                <span
                  title="Nombre de semaines à assigner pour cette activité. Entre 1 et nombre de semaine de la plage (choisie plus haut)."
                  class="interrogationmark"
                  >?
                </span>
              </th>
              <!-- Cell to display when the array is empty because no activity is defined -->
              <th v-if="activities.length == 0" class="p-2">
                Pas d'activité...
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in nbWeeksInInt" :key="week">
              <td
                class="text-center cell"
                v-for="cell in cells[week]"
                :key="cell.id"
              >
                <!-- Cell content. Display bold if it's a priority member. -->
                <span
                  class="text-base italic"
                  :class="{
                    'font-bold':
                      cell.member != null
                        ? members[cell.member - 1].priority && priorityMode
                        : false
                  }"
                >
                  {{
                    cell.member != null
                      ? getNameOfMember(cell.member)
                      : cell.toassign == true
                      ? "-"
                      : "/"
                  }}
                </span>
                <span v-if="false"> toa{{ cell.toassign ? 1 : 0 }}</span>
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

      <!-- Statistics zone -->
      <div v-if="true">
        <!-- debug temp -->
        <div>
          <div class="text-lg font-bold">Statistiques</div>
          <div>
            <!-- Statistics table -->
            <table>
              <thead>
                <tr>
                  <th class="cell whitespace-nowrap">Nb. assignations</th>
                  <th class="cell whitespace-nowrap">Nb. membres</th>
                  <th class="cell whitespace-nowrap">
                    Membres

                    <!-- Interrogation mark to explain what are bold members -->
                    <span v-if="priorityMode"
                      ><span
                        title="Les membres prioritaires sont en gras."
                        class="interrogationmark"
                        >?
                      </span></span
                    >
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- One line per number until maximum is reached. Decrement count =  getBiggestAssignationCount - n + 1 -->
                <tr v-for="n in getBiggestAssignationCount + 1" :key="n">
                  <!-- As v-if with v-for is not possible, apply the v-if on the 3 header cell. The goal is to display only row that display members.-->
                  <td
                    class="text-center cell"
                    v-if="
                      membersForGivenAssignationCount(
                        getBiggestAssignationCount - n + 1
                      ).length != 0
                    "
                  >
                    {{ getBiggestAssignationCount - n + 1 }}
                  </td>
                  <td
                    class="text-center cell"
                    v-if="
                      membersForGivenAssignationCount(
                        getBiggestAssignationCount - n + 1
                      ).length != 0
                    "
                  >
                    {{
                      membersForGivenAssignationCount(
                        getBiggestAssignationCount - n + 1
                      ).length
                    }}
                  </td>
                  <td
                    class="cell"
                    v-if="
                      membersForGivenAssignationCount(
                        getBiggestAssignationCount - n + 1
                      ).length != 0
                    "
                  >
                    <div>
                      <span
                        v-for="(member,
                        index) in membersForGivenAssignationCount(
                          getBiggestAssignationCount - n + 1
                        )"
                        :key="member"
                      >
                        <span
                          v-if="member != undefined"
                          :class="{
                            'font-bold': member.priority && priorityMode
                          }"
                        >
                          {{ member.name }}
                          <!-- Display a dash, except when the member is the last one in the list -->
                          {{
                            membersForGivenAssignationCount(
                              getBiggestAssignationCount - n + 1
                            ).length >
                            index + 1
                              ? " - "
                              : ""
                          }}
                        </span></span
                      >
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center cell">
                    Assignations:
                    {{
                      this.arrayOfCells.filter(cell => {
                        return cell.member != null;
                      }).length
                    }}
                  </td>
                  <td class="text-center cell">{{ this.members.length }}</td>
                </tr>
              </tbody>
            </table>
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
      priorityMode: true,
      generated: false,
      nbWeeks: 2,
      activitiesRaw: "Vaisselle\nRangement\nLessive",
      cells: [],
      activities: [],
      assignedMembers: [],
      members: [],
      membersRaw:
        "Johndoe	P\nAlicia	P\nJack\nLion\nJulie\nSam	P\nJohnson\nLili\nMila	P"
    };
  },
  computed: {
    //Get the biggest assignation count for the statistics array with the first row
    getBiggestAssignationCount() {
      var max = 0;
      this.assignationsByMember.forEach(member => {
        max = member.list.length > max ? member.list.length : max;
      });
      return max;
    },
    assignationsByMember() {
      //debug temp
      if (this.generated == false) {
        var assignations = [];
        var oneMemberAssignation;

        for (var member of this.members) {
          oneMemberAssignation = { id: member.id, list: null }; //an object (not an array) of assignations indexed by member id
          //Push all assignations of a member to the assignations array indexed by id
          oneMemberAssignation.list = JSON.parse(
            JSON.stringify(
              this.arrayOfCells.filter(cell => {
                return cell.member == member.id;
              })
            )
          );
          assignations.push(oneMemberAssignation);
        }
        //Sort by length of arrays descendant
        assignations.sort((a, b) => {
          return b.list.length - a.list.length;
        });
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
    //Get array of members who have a certain number of assignations (useful for the statistics table)
    membersForGivenAssignationCount(count) {
      var array = [];
      for (var member of this.assignationsByMember) {
        if (member.list.length == count) {
          array.push(this.members[member.id - 1]); //push the member object to the array
        }
      }
      console.log(count);
      console.log(array);
      return array;
    },
    //Count priority members
    countPriorityMembers() {
      return this.members.filter(member => {
        return member.priority;
      }).length;
    },
    //If the user click on certain inputs after generation, alert that modification is not possible until results are emptied.
    alertInputNotModifiableAfterGeneration(e) {
      if (this.generated) {
        //Prevent default behavior to block value modification
        e.preventDefault();
        //Alert the user about what's happening
        alert(
          "La modification de ce champ n'est pas permise pour car cela supprime les résultats. Si vous voulez vraiment modifier ce champ, videz d'abord les résultats."
        );
      }
    },
    //On change on this.nbWeeks through the input, set all activity.number to the new value
    onNbWeeksChange() {
      this.activities.forEach(activity => {
        activity.number = this.nbWeeks;
      });
      //Then init cells
      this.initCells();
    },
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

          //While some cells not assigned and that should be assigned (toassign = true) exist for the current week, continue to assign members for these cells
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
              //Cell is chosen depending on the activity, so generate a random int between 0 and (nb of activities -1)
              activityIndex = Math.round(
                Math.random() * (this.activities.length - 1)
              );
              //console.log(activityIndex);
              //console.log(this.cells[weekId]);
              cell = this.cells[weekId][activityIndex];
            } while (cell.member != null || cell.toassign != true); //and continue while no cell without member is found (will not cause infinite loop because parent)

            var priorityMemberOnly = false;
            if (this.priorityMode) {
              // In yet in priority member assignation because number of members in priority in higher than assignations count.
              priorityMemberOnly =
                this.countPriorityMembers() > assignationCount;
            }

            cell.member = this.getRandomNotAssignedMember(priorityMemberOnly);
            this.cells[weekId][activityIndex] = cell;
            assignationCount++;
          }
        }
        //TEMP comment: this.generated = true;
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
    //Get a random not assigned member. If priorityMemberOnly == true, choose only a priority member.
    getRandomNotAssignedMember(priorityMemberOnly = false) {
      var randomMemberId = -1;

      //Search for a random member not assigned (look in notAssignedMembers for that) and that is priority if required
      do {
        //When every member has been assigned, reset the assignedMembers array for the next round
        if (this.membersNotAssigned.length == 0) {
          this.assignedMembers = [];
        }

        randomMemberId = Math.round(Math.random() * (this.nbMembers - 1)) + 1; //get a random member id (random integer between 1 and nbMembers inclusive)

        //Is the member in priority (if required by priorityMemberOnly) ?
        var isPriorityIfRequired = priorityMemberOnly
          ? this.members[randomMemberId - 1].priority == true
          : true;
      } while (
        this.assignedMembers.includes(randomMemberId) == true ||
        isPriorityIfRequired == false
      ); //while the member is already assigned and if isPriorityIfRequired is not respected

      this.assignedMembers.push(randomMemberId); //add the chosen member to the list of assigned members
      return randomMemberId;
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
      //Replace every tab with an enter char. To import activities list faster with copy paste from a spreadsheet. (When you copy cells in spreadsheet, you got tab char between values).
      if (this.activitiesRaw.indexOf("\t") != -1) {
        this.activitiesRaw = this.activitiesRaw.replaceAll("\t", "\n");
      }
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
      this.generated = false; //Everything is deleted after cells init, so define state as "not generated"
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
