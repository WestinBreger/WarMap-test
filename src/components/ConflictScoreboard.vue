<template>
  <div class="scoreboard">
    <!-- Bastion Side -->
    <div class="scoreCard bastion">
      <div class="sideLabel bastion-label">⚔ BASTION</div>
      <div class="stats">
        <div class="stat">
          <span class="statValue">{{ bastionTiles }}</span>
          <span class="statLabel">Tiles</span>
        </div>
        <div class="statDivider" />
        <div class="stat">
          <span class="statValue">{{ bastionWins }}</span>
          <span class="statLabel">Wins</span>
        </div>
        <div class="statDivider" />
        <div class="stat">
          <span class="statValue">{{ bastionFighters }}</span>
          <span class="statLabel">Fighters</span>
        </div>
      </div>
    </div>

    <!-- VS divider -->
    <div class="vsBlock">
      <div class="roundLabel">R{{ curRound }}</div>
    </div>

    <!-- Pyre Side -->
    <div class="scoreCard pyre">
      <div class="sideLabel pyre-label">🔥 PYRE</div>
      <div class="stats">
        <div class="stat">
          <span class="statValue">{{ pyreTiles }}</span>
          <span class="statLabel">Tiles</span>
        </div>
        <div class="statDivider" />
        <div class="stat">
          <span class="statValue">{{ pyreWins }}</span>
          <span class="statLabel">Wins</span>
        </div>
        <div class="statDivider" />
        <div class="stat">
          <span class="statValue">{{ pyreFighters }}</span>
          <span class="statLabel">Fighters</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { CURRENT_ROUND, ALL_FIGHTERS_IN_ROUND } from "../state/getters"

export default {
  name: "ConflictScoreboard",
  computed: {
    ...mapGetters({
      curRound: CURRENT_ROUND,
      allFighters: ALL_FIGHTERS_IN_ROUND
    }),
    roundData() {
      return this.$store.state.roundData[this.curRound]
    },
    tiles() {
      return Object.values(this.roundData).filter(
        t => typeof t === "object" && t !== null && "location" in t
      )
    },
    bastionTiles() {
      return this.tiles.filter(t => t.owner === "bastion").length
    },
    pyreTiles() {
      return this.tiles.filter(t => t.owner === "pyre").length
    },
    bastionWins() {
      return this.tiles.filter(
        t => t.outcome && t.outcome.bastion === "win"
      ).length
    },
    pyreWins() {
      return this.tiles.filter(
        t => t.outcome && t.outcome.pyre === "win"
      ).length
    },
    bastionFighters() {
      return this.allFighters(true).length
    },
    pyreFighters() {
      return this.allFighters(false).length
    }
  }
}
</script>

<style scoped>
.scoreboard {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  margin-top: 0.4em;
  gap: 0;
  border-radius: 0.4em;
  overflow: hidden;
  border: 1px solid rgba(189, 136, 58, 0.4);
  background-color: rgb(30, 5, 15);
}

.scoreCard {
  flex: 1;
  padding: 0.35em 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
}

.scoreCard.bastion {
  background: linear-gradient(
    135deg,
    rgba(20, 50, 100, 0.5) 0%,
    rgba(10, 20, 50, 0.3) 100%
  );
}

.scoreCard.pyre {
  background: linear-gradient(
    225deg,
    rgba(120, 30, 10, 0.5) 0%,
    rgba(50, 10, 5, 0.3) 100%
  );
}

.sideLabel {
  font-family: "Suez One", serif;
  font-size: 0.65em;
  letter-spacing: 0.08em;
  font-weight: bold;
  white-space: nowrap;
}

.bastion-label {
  color: #7ab4f5;
}

.pyre-label {
  color: #f57a4a;
}

.stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3em;
  width: 100%;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05em;
  flex: 1;
}

.statValue {
  font-family: "Saira", sans-serif;
  font-size: 1.1em;
  font-weight: bold;
  line-height: 1;
  color: #f0d080;
}

.statLabel {
  font-size: 0.5em;
  color: rgb(160, 140, 120);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.statDivider {
  width: 1px;
  height: 1.8em;
  background-color: rgba(189, 136, 58, 0.25);
  flex-shrink: 0;
}

.vsBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.2em 0.5em;
  background-color: rgba(189, 136, 58, 0.1);
  border-left: 1px solid rgba(189, 136, 58, 0.3);
  border-right: 1px solid rgba(189, 136, 58, 0.3);
  flex-shrink: 0;
}

.roundLabel {
  font-family: "Suez One", serif;
  font-size: 0.7em;
  color: rgb(189, 136, 58);
  letter-spacing: 0.05em;
}
</style>
