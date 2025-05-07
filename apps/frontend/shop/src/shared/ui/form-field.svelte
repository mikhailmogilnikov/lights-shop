<script lang="ts">
  export let label: string;
  export let id: string;
  export let type: string = 'text';
  export let value: string = '';
  export let error: string | undefined = undefined;
  export let required: boolean = false;
  export let onBlur: (() => void) | undefined = undefined;
</script>

<div class="flex flex-col gap-2">
  <label for={id} class="text-sm font-medium">{label}</label>
  <input
    {type}
    {id}
    bind:value
    on:blur={onBlur}
    class="px-3 py-2 border rounded-md {error ? 'border-danger' : 'border-divider'}"
    {required}
  />
  {#if error}
    <span class="text-sm text-danger">{error}</span>
  {/if}
</div>
