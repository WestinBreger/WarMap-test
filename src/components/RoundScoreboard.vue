<template>
  <div class="scoreboard" v-if="curRound > 0">
    <div class="scoreboard-row">
      <div class="faction-block bastion-block">
        <span class="faction-name bastion-name">Bastion</span>
        <span class="stat-group">
          <span class="stat-label">Holds</span>
          <span class="stat-value bastion-value">{{
            tileCounts.bastion.held
          }}</span>
        </span>
        <span class="stat-divider">|</span>
        <span class="stat-group">
          <span class="stat-label">Took</span>
          <span class="stat-value bastion-value">{{
            tileCounts.bastion.took
          }}</span>
        </span>
      </div>

      <div class="faction-block pyre-block">
        <span class="faction-name pyre-name">Pyre</span>
        <span class="stat-group">
          <span class="stat-label">Holds</span>
          <span class="stat-value pyre-value">{{ tileCounts.pyre.held }}</span>
        </span>
        <span class="stat-divider">|</span>
        <span class="stat-group">
          <span class="stat-label">Took</span>
          <span class="stat-value pyre-value">{{ tileCounts.pyre.took }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { CURRENT_ROUND, ROUND_TILE_COUNTS } from "../state/getters"

export default {
  name: "RoundScoreboard",
  computed: {
    ...mapGetters({
      curRound: CURRENT_ROUND,
      tileCounts: ROUND_TILE_COUNTS
    })
  }
}
</script>

<style scoped>
.scoreboard {
  width: 100%;
  margin-top: 0.4em;
  padding: 0.3em 0.5em;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.3em;
  border: 1px solid rgba(189, 136, 58, 0.4);
}

.scoreboard-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 0.5em;
}

.faction-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4em;
  flex: 1;
  justify-content: center;
}

.bastion-block {
  border-right: 1px solid rgba(189, 136, 58, 0.3);
  padding-right: 0.5em;
}

.faction-name {
  font-family: "Suez One", serif;
  font-size: 0.85em;
  font-weight: bold;
  min-width: 3.5em;
}

.bastion-name {
  color: #5b9bd5;
}

.pyre-name {
  color: #e05c3a;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.6em;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: "Suez One", serif;
  font-size: 1.1em;
  font-weight: bold;
}

.bastion-value {
  color: #7ab8f5;
}

.pyre-value {
  color: #f07a5a;
}

.stat-divider {
  color: rgba(189, 136, 58, 0.5);
  font-size: 1em;
  margin: 0 0.1em;
}

@media only screen and (max-width: 840px) {
  .scoreboard {
    font-size: 0.85em;
    padding: 0.2em 0.3em;
  }

  .faction-name {
    font-size: 0.75em;
    min-width: 3em;
  }
}
</style>
