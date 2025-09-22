
// ...existing code...

const ser = new URLSearchParams(window.location.search);

// 假设你有 id 和 text 变量
const id = Number(ser.get('id'));
const end = Number(ser.get('end'));
const go = ser.get('go');

function run() {

  document.title = 'AZ 104'

  // 只替换 .answer-description 内的 <br>
  document.querySelectorAll('br').forEach(br => {
    const div = document.createElement('div');
    div.style.height = '4px';
    br.parentNode.replaceChild(div, br);
  });

  document.querySelector('.container .action-row-container')?.remove();
  document.querySelector('.question-discussion-header #info div')?.remove();
  document.querySelector('.voted-answers-tally')?.remove();

  const info = document.querySelector('.question-discussion-header #info');
  info.innerText = info.innerText.replace('Question #', 'Question ').replace('Topic #', ' Topic');

  document.querySelector('a.reveal-solution')?.remove();
  document.querySelector('a.hide-solution')?.remove();
  document.querySelector('.contrib__ulimited.contrib__block')?.remove();
  document.querySelector('.container style')?.remove();
  document.querySelector('.container .discussion-page-comments-section')?.remove();
  document.querySelector('.container .row')?.remove();
  document.querySelector('#voting-comment-tooltip')?.remove();
  document.querySelector('#report-comment-modal')?.remove();



  const img = Array.from(document.querySelectorAll('.discussion-header-container img')).map((img, index) => {
    const src = img.src;
    const name = `${id}_${index}`;
    img.src = `img/${name}.${src.split('.').pop()}`;
    return { src, name };
  });


  fetch('http://localhost:3000/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, img, text: document.querySelector('.discussion-header-container').outerHTML })
  })
    .then(response => response.json())
    .then((res) => {
      console.log('Success:', res?.message);
      // 请求完成后，跳转到 id+1 的页面
      const url = new URL(window.location.href);
      const next = id + 1
      url.searchParams.set('id', next);
      if (next <= end) {
        window.location.href = url.toString();
      } else {
        console.info('end index : ', end);
      }
    }).catch((error) => {
      console.error('Error:', error);
    });

}


function waitForElement() {
  return new Promise((resolve, reject) => {

    if (!go || !end) {
      reject('bey bey...');
    }

    function fn() {
      setTimeout(() => {
        const element = document.querySelector('.answer-description');
        if (element) {
          resolve(element);
        } else {
          fn(); // 继续等待
        }
      }, 400);
    }

    fn();
  });

}


waitForElement().then(() => run()).catch((err) => {
  console.info(err.message || err);
});