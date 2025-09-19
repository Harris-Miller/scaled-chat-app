

const postChat = async () => {
  try {
    const text = await Bun.fetch(`http://localhost:3008/ping`).then(r => (r.ok ? r : Promise.reject(r))).then(r => r.text());
    console.log('text');
  } catch (e) {
    console.log(e);
  }
};

// postChat();

const delayBetweenPosts = 200;
console.log(`Sending every ${delayBetweenPosts}ms...`);
setInterval(postChat, delayBetweenPosts);
