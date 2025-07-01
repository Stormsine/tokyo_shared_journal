
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// ../netlify/functions/scheduled-function/scheduled-function.mjs
var scheduled_function_default = async (req) => {
  const { next_run } = await req.json();
  console.log("Received event! Next invocation at:", next_run);
};
var config = {
  schedule: "@hourly"
};
export {
  config,
  scheduled_function_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbmV0bGlmeS9mdW5jdGlvbnMvc2NoZWR1bGVkLWZ1bmN0aW9uL3NjaGVkdWxlZC1mdW5jdGlvbi5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFRvIGxlYXJuIGFib3V0IHNjaGVkdWxlZCBmdW5jdGlvbnMgYW5kIHN1cHBvcnRlZCBjcm9uIGV4dGVuc2lvbnMsXG4vLyBzZWU6IGh0dHBzOi8vbnRsLmZ5aS9zY2hlZC1mdW5jXG5leHBvcnQgZGVmYXVsdCBhc3luYyAocmVxKSA9PiB7XG4gIGNvbnN0IHsgbmV4dF9ydW4gfSA9IGF3YWl0IHJlcS5qc29uKClcblxuICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgZXZlbnQhIE5leHQgaW52b2NhdGlvbiBhdDonLCBuZXh0X3J1bilcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgc2NoZWR1bGU6ICdAaG91cmx5Jyxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFFQSxJQUFPLDZCQUFRLE9BQU8sUUFBUTtBQUM1QixRQUFNLEVBQUUsU0FBUyxJQUFJLE1BQU0sSUFBSSxLQUFLO0FBRXBDLFVBQVEsSUFBSSx1Q0FBdUMsUUFBUTtBQUM3RDtBQUVPLElBQU0sU0FBUztBQUFBLEVBQ3BCLFVBQVU7QUFDWjsiLAogICJuYW1lcyI6IFtdCn0K
