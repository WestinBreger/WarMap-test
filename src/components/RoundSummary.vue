<template>
  <div class="topContainer">
    <div class="title desktop">
      {{ isBastion ? "Bastion" : "Pyre" }} Fighters - Round {{ curRound }}
    </div>
    <div class="scoreboard desktop">
      <div class="scoreboardRow">
        <div class="scoreboardFaction bastion-label">Bastion</div>
        <div class="scoreboardVs">vs</div>
        <div class="scoreboardFaction pyre-label">Pyre</div>
      </div>
      <div class="scoreboardRow">
        <div class="scoreboardCount bastion-count">
          {{ scoreboard.bastion }}
        </div>
        <div class="scoreboardTiles">tiles</div>
        <div class="scoreboardCount pyre-count">{{ scoreboard.pyre }}</div>
      </div>
      <div class="scoreboardContested" v-if="scoreboard.contested > 0">
        {{ scoreboard.contested }} contested
      </div>
    </div>
    <div class="scrollContainer">
      <table>
        <tr class="entry" v-for="f in shownFighters" :key="f.id">
          <td class="fighterName">
            {{ f.name }}
          </td>
          <td class="TileLocation">
            <div class="warpLink" @click="selectTile(f.tile)">
              {{ f.tile.toUpperCase() }}
            </div>
          </td>
          <td>
            <StrikeLink
              :fighterId="f.id"
              :round="curRound"
              :inputURL="f.link"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import StrikeLink from "./elements/StrikeLink.vue"

import { mapGetters } from "vuex"
import {
  ALL_FIGHTERS_IN_ROUND,
  CURRENT_ROUND,
  ROUND_SCOREBOARD
} from "../state/getters"
import { NEW_SELECTED } from "../state/mutations"

export default {
  data: function() {
    return {}
  },
  components: {
    StrikeLink
  },
  beforeMount: function() {
    this.fighters = this.allFighters(this.isBastion)
  },
  props: {
    isBastion: Boolean
  },
  computed: {
    shownFighters: function() {
      return this.allFighters(this.isBastion)
    },
    ...mapGetters({
      allFighters: ALL_FIGHTERS_IN_ROUND,
      curRound: CURRENT_ROUND,
      scoreboard: ROUND_SCOREBOARD
    })
  },
  methods: {
    selectTile(tile) {
      this.$store.commit(NEW_SELECTED, tile)
    }
  },
  name: "RoundSummary"
}
</script>

<style scoped>
.scrollContainer {
  overflow-y: auto;
  height: 75%;
}

.title {
  font-family: "Suez One", serif;
  font-size: 1.8em;
  margin-bottom: 2%;
}

.warpLink {
  cursor: pointer;
  font-weight: bold;
  color: rgb(88, 161, 15);
}

/* Scoreboard styles */
.scoreboard {
  margin-bottom: 6%;
  padding: 0.4em 0.5em;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.4em;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.scoreboardRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.scoreboardFaction {
  font-family: "Suez One", serif;
  font-size: 0.85em;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.bastion-label {
  color: rgb(100, 160, 230);
}

.pyre-label {
  color: rgb(230, 100, 60);
}

.scoreboardVs {
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.5);
  flex: 0 0 auto;
  padding: 0 0.4em;
}

.scoreboardCount {
  font-family: "Suez One", serif;
  font-size: 1.6em;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.bastion-count {
  color: rgb(100, 160, 230);
}

.pyre-count {
  color: rgb(230, 100, 60);
}

.scoreboardTiles {
  font-size: 0.65em;
  color: rgba(255, 255, 255, 0.5);
  flex: 0 0 auto;
  padding: 0 0.4em;
  text-align: center;
}

.scoreboardContested {
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  margin-top: 0.2em;
}

@media only screen and (max-width: 840px) {
  .desktop {
    display: none;
  }
}
</style>
