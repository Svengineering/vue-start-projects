
const template = `
      <h1>Hallo, {{name}}! <i class="fa-regular fa-house"></i></h1>
      <div v-if="workers.length === 0">No workers available.</div>
      <div v-else>
        <div style="margin-bottom: 10px;">
          <input v-model="searchString" placeholder="Suche" /><i class="fa-regular fa-lightbulb"></i>
        </div>
        <table>
          <thead>
            <th v-for="header in headers" @click="setSortColumn(header.key)">
              {{header.value}}
              <i class="fa-regular" :class="{ 'fa-circle': this.sortColumn !== header.key, 'fa-circle-up': this.sortColumn === header.key && this.order === 'DESC', 'fa-circle-down': this.sortColumn === header.key && this.order === 'ASC' }"></i>
            </th>
          </thead>
          <tbody>
              <tr v-for="(worker, index) in filteredWorkers" :key="index">
                  <td>{{worker.name}}</td>
                  <td>{{worker.position}}</td>
                  <td>{{worker.office}}</td>
                  <td>{{worker.age}}</td>
              </tr>
          </tbody>
        </table>
      </div> 
</template>
`;


export default {
    props: ["headers", "workers"],
    data() {
        return {
            sortColumn: "",
            order: "ASC",
            searchString: "",
            name: 'Nivethan',
        }
    },
    computed: {
        filteredWorkers() {
            const filteredWorkers = this.searchString === ""
                ? this.workers
                : this.workers.filter(wo => Object.values(wo).join("").toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1);

            const column = this.sortColumn
            const order = this.order;

            filteredWorkers.sort(function(a, b) {
                var nameA = a[column]+"".toUpperCase();
                var nameB = b[column]+"".toUpperCase();
                if (order === "DESC" && nameA > nameB) {
                    return -1;
                }
                if (order === "DESC" && nameA < nameB) {
                    return 1;
                }
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });

            return filteredWorkers;
        }
    },
    methods: {
        setSortColumn(column) {
            if (this.sortColumn === column) {
                this.order = this.order === "ASC" ? "DESC" : "ASC";
            } else {
                this.order = "ASC";
                this.sortColumn = column;
            }
        }
    },
    template: template
}