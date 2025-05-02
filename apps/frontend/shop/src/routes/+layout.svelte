<script lang="ts">
  import '../app.css';
  import { Header } from '../widgets/header/index';
  let { children } = $props();
</script>

<Header />
{@render children()}
