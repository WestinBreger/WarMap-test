<template>
  <div class="scoreboard">
    <div class="scoreboard-row">
      <div class="faction-block bastion-block">
        <img
          class="faction-icon"
          src="../assets/pics/bastion-standin.png"
          alt="Bastion"
        />
        <div class="faction-name bastion-name">Bastion</div>
        <div class="tile-count bastion-count">{{ tileCounts.bastion }}</div>
        <div class="tile-label">tiles</div>
      </div>

      <div class="vs-divider">vs</div>

      <div class="faction-block pyre-block">
        <img
          class="faction-icon"
          src="../assets/pics/pyre-standin.png"
          alt="Pyre"
        />
        <div class="faction-name pyre-name">Pyre</div>
        <div class="tile-count pyre-count">{{ tileCounts.pyre }}</div>
          <div class="tile-label">tiles</div>
      </div>
    </div>

    <div class="score-bar-container" v-if="totalContested > 0">
      <div
        class="score-bar bastion-bar"
        :style="{ width: bastionPct + '%' }"
        :title="'Bastion: ' + tileCounts.bastion + ' tiles'"
      ></div>
      <div
        class="score-bar pyre-bar"
        :style="{ width: pyrePct + '%' }"
        :title="'Pyre: ' + tileCounts.pyre + ' tiles'"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { FACTION_TILE_COUNTS, CURRENT_ROUND } from "../state/getters"

export default {
  name: "FactionScoreboard",
  computed: {
    ...mapGetters({
      tileCounts: FACTION_TILE_COUNTS,
      curRound: CURRENT_ROUND
    }),
    totalContested() {
      return this.tileCounts.bastion + this.tileCounts.pyre
    },
    bastionPct() {
      if (this.totalContested === 0) return 50
      return (this.tileCounts.bastion / this.totalContested) * 100
    },
    pyrePct() {
      if (this.totalContested === 0) return 50
      return (this.tileCounts.pyre / this.totalContested) * 100
    }
  }
}
</script>

<style scoped>
.scoreboard {
  width: 100%;
  padding: 0.3em 0 0.2em 0;
}

.scoreboard-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.faction-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4.5em;
}

.faction-icon {
  width: 2em;
  height: 2em;
  object-fit: contain;
}

.faction-name {
  font-family: "Suez One", serif;
  font-size: 0.75em;
  margin-top: 0.1em;
}

.bastion-name {
  color: #5b9bd5;
}

.pyre-name {
  color: #e05c2a;
}

.tile-count {
  font-family: "Suez One", serif;
  font-size: 1.4em;
  line-height: 1;
}

.bastion-count {
  color: #5b9bd5;
}

.pyre-count {
  color: #e05c2a;
}

.tile-label {
  font-size: 0.6em;
  color: #c8a060;
  margin-top: 0.1em;
}

.vs-divider {
  font-family: "Suez One", serif;
  font-size: 0.9em;
  color: #c8a060;
  padding: 0 0.3em;
}

.score-bar-container {
  display: flex;
  flex-direction: row;
  width: 90%;
  height: 0.4em;
  margin: 0.4em auto 0 auto;
  border-radius: 0.2em;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
}

.score-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.bastion-bar {
  background-color: #5b9bd5;
}

.pyre-bar {
  background-color: #e05c2a;
}

@media only screen and (max-width: 840px) {
  .faction-icon {
    width: 1.5em;
    height: 1.5em;
  }

  .tile-count {
    font-size: 1.1em;
  }
}
</style>
