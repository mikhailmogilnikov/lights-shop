<script lang="ts">
  import '../app.css';
  import { Header } from '../widgets/header/index';
  import { CartSheet } from '../entities/cart';
  let { children } = $props();
</script>

<CartSheet />
<Header />
{@render children()}
