# encounter-backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


# Architecture

* postgres
  * user table
  * character table
    * belong to user
    * belong to campaign (only one at a time)
  * campaign table
    * belong to user (DM only)
  * encounters 
    * belong to campaign
  * monsters
    * belong to encounters
  * moves
    * belong to encounters
    * history of actions taken in encounters, every thing from "next in initiative" to applying damage, conditions, using spell slots,
      adding new monsters to initiative. Anything that can be "undone"

Campaigns can have players added to them if the DM gives them to "join" link. Able to manage who still
Player's view of campaign page for MVP will just be a "no active encounter" page that displays what DM + Players are actively online or not
Page changes to "active encounter" when the DM sets it. A campaign can have many encounters, but only one active at a time
WebSockets to manage real-time info 
* essentially passing "moves" to set existing state same for all players to update local state _after_ initial grab
* since those moves will also update player/monster status, we can compare move timestamps to player/monster timestamps to see reconcile latency differences
  * or lock on status get so new updates have to way
* WebSocket should update DB first _then_ send out to subscribers, so if something fails, just need to revert local state for the person who sent the update

* redis
  * utilize for socket-io plugin, maybe BullMQ as well once we scale
  * later optimization: use as in-mem DB for active encounters for read/writes, sending writes to DB after for history? (not sure if this would even be needed)

* Auth
  * short term is no login, just create a ulid via frontend, save that in localStorage, use in HTTP headers as a simple mock-auth
  * later replace with AWS Cognito
