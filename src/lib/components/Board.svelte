<script lang="ts">
  import { Board, Disk, type Cell } from "$lib/board";

  interface Props {
    moves: string;
    onColumnClick: (col: number) => void;
  }

  let { moves, onColumnClick }: Props = $props();

  let board = $derived(Board.fromStr(moves));

  function backgroundColorOf(cell: Cell) {
    if (cell === null) return "#AAA";
    return cell === Disk.X ? "#F00" : "#FF0";
  }
</script>

<div class="board">
  {#each board.matrix as col, c}
    <div class="col" onclick={() => onColumnClick(c)}>
      {#each col as cell, r}
        <div
          class="cell"
          style={`background-color: ${backgroundColorOf(cell)}`}
        ></div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .col {
    display: flex;
    flex-direction: column-reverse;
    gap: 4px;
  }

  .cell {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
