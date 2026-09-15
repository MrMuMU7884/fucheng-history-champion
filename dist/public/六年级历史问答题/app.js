let questions=[...bank], index=0, selected=null, revealed=false, correct=0, attempted=0;
const $=id=>document.getElementById(id);
const letters=['A','B','C','D'];
const shuffled=a=>[...a].sort(()=>Math.random()-.5);
function render(){
  const item=questions[index]; selected=null;revealed=false;
  $('counter').textContent=`第 ${index+1} / ${questions.length} 题`;
  $('unitLabel').textContent=`${unitMeta[item.u-1][0]} • ${unitMeta[item.u-1][1]}`;
  $('question').textContent=item.question;
  $('result').textContent='';$('result').className='result';
  const answers=shuffled([item.answer,...item.wrong]);
  $('answers').replaceChildren(...answers.map((answer,i)=>{const b=document.createElement('button');b.className='answer';b.dataset.answer=answer;b.innerHTML=`<span class="letter">${letters[i]}</span>${answer}`;b.onclick=()=>choose(b);return b;}));
}
function choose(button){if(revealed)return;document.querySelectorAll('.answer').forEach(b=>b.classList.remove('chosen'));button.classList.add('chosen');selected=button.dataset.answer;}
function reveal(){if(revealed)return;if(!selected){$('result').textContent='请先选择一个答案。';$('result').className='result bad';return;}revealed=true;attempted++;const item=questions[index];const win=selected===item.answer;if(win)correct++;document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;if(b.dataset.answer===item.answer)b.classList.add('correct');if(b.dataset.answer===selected&&!win)b.classList.add('wrong');});$('result').textContent=win?'恭喜🎉，您答对了':'别灰心，再试一次！';$('result').className=`result ${win?'good':'bad'}`;$('score').textContent=`得分：${correct} / ${attempted}`;}
function next(){if(!revealed)return;if(index===questions.length-1){$('result').textContent=`问答结束！最终得分：${correct} / ${questions.length}`;return;}index++;render();}
function restart(){questions=shuffled(bank);index=0;correct=0;attempted=0;$('score').textContent='得分：0 / 0';render();}
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();revealed?next():reveal();}});restart();
