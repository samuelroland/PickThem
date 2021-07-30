<template>
  <div class="text-3xl text-green-700">
    PickThem<span class="text-sm italic">v1.0</span>
  </div>
  <div class="text-gray-600 italic">
    App minimaliste pour choisir les membres qui feront les tâches reproductives
    les 6 prochaines semaines.
  </div>
  <hr />

  <div>
    <div class="font-bold text-xl mt-1">Configuration</div>
    <div class="flex justify-center">
      <div>
        Nb de semaines:
        <input class="w-12" type="number" min="1" v-model="nbWeeks" />
      </div>
    </div>
    <div class="flex flex-grow">
      <div class="w-full pr-3">
        <div class="text-sm">{{ activities.length }} tâches détectées.</div>
        <textarea
          class="w-full"
          v-model="activitiesRaw"
          rows="8"
          placeholder="Liste de tâches: Rentrez une tâche par ligne."
          @keyup="loadActivities"
        ></textarea>
      </div>

      <div class="w-full">
        <div class="text-sm">{{ members.length }} membres détecté·es.</div>
        <textarea
          class="w-full"
          v-model="membersRaw"
          rows="8"
          placeholder="Liste de membres: Rentrez un·e membre par ligne."
          @keyup.enter="loadMembers"
          @change="loadMembers"
        ></textarea>
      </div>
    </div>

    <div class="w-full justify-center">
      <div class="my-1 flex justify-center items-center">
        <div class="font-bold text-xl">Génération aléatoire</div>
        <button class="ml-2" @click="generate">Go</button>
      </div>
      <div class="flex justify-center mb-3">
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
          name: name
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
