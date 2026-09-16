const QUESTION_COUNT=30;
const REBATE_PER_CORRECT=1;
const GOOGLE_SHEET_WEB_APP_URL='https://script.google.com/macros/s/AKfycbyYx5Bb1Y5JAem0oi0vgMtx_Dh1l113u_GaDlfzK-t0eJn6GXO47FJKf1PZfixKNpYrBw/exec';
let questions=[],index=0,selected=null,revealed=false,correct=0,student={};
const $=id=>document.getElementById(id),letters=['A','B','C','D'];
const shuffled=list=>[...list].sort(()=>Math.random()-.5);
const questionKey=item=>`${item.answer}|${item.question.replace(/^(根据课本，|请选出正确答案：|下列说法中，正确的是：)/,'')}`;
function pickUniqueQuestions(items,count){const seen=new Set();return shuffled(items).filter(item=>{const key=questionKey(item);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,count);}
function render(){const item=questions[index];selected=null;revealed=false;$('counter').textContent=`第 ${index+1} / ${QUESTION_COUNT} 题`;$('unitLabel').textContent=`${unitMeta[item.u-1][0]} • ${unitMeta[item.u-1][1]}`;$('question').textContent=item.question;$('result').textContent='';$('result').className='result';$('actionButton').disabled=true;$('actionButton').textContent='确认答案';const answers=shuffled([item.answer,...item.wrong]);$('answers').replaceChildren(...answers.map((answer,i)=>{const button=document.createElement('button');button.className='answer';button.dataset.answer=answer;button.innerHTML=`<span class="letter">${letters[i]}</span>${answer}`;button.onclick=()=>choose(button);return button;}));}
function choose(button){if(revealed)return;document.querySelectorAll('.answer').forEach(item=>item.classList.remove('chosen'));button.classList.add('chosen');selected=button.dataset.answer;$('actionButton').disabled=false;}
function confirmAnswer(){if(revealed){next();return;}if(!selected)return;revealed=true;const item=questions[index],win=selected===item.answer;if(win)correct++;document.querySelectorAll('.answer').forEach(button=>{button.disabled=true;if(button.dataset.answer===item.answer)button.classList.add('correct');if(button.dataset.answer===selected&&!win)button.classList.add('wrong');});$('result').textContent=win?'恭喜🎉，您答对了':'别灰心，下一题继续加油！';$('result').className=`result ${win?'good':'bad'}`;$('score').textContent=`得分：${correct} / ${index+1}`;$('actionButton').disabled=false;$('actionButton').textContent=index===QUESTION_COUNT-1?'查看成绩':'下一题';}
function next(){if(index<QUESTION_COUNT-1){index++;render();return;}finish();}
function finish(){const rebate=correct*REBATE_PER_CORRECT;$('result').textContent=`恭喜您，答对了 ${correct} 题，请联系 011-36642900 领取 RM${rebate} 的学费回扣。礼券有效于非本院生。`;$('result').className='result good';$('actionButton').textContent='再挑战一次';$('actionButton').onclick=()=>location.reload();submitResult(rebate);}
function submitResult(rebate){const record={submittedAt:new Date().toISOString(),grade:window.QUIZ_GRADE,name:student.name,school:student.school,phone:student.phone,referrer:student.referrer||'',score:correct,totalQuestions:QUESTION_COUNT,rebate};if(GOOGLE_SHEET_WEB_APP_URL)fetch(GOOGLE_SHEET_WEB_APP_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(record)}).catch(()=>{});}
const registrationConfig=window.QUIZ_REGISTRATION||{name:'studentName',phone:'phone'};
$('registrationForm').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);student={name:form.get(registrationConfig.name).trim(),school:form.get('school').trim(),phone:form.get(registrationConfig.phone).trim(),referrer:registrationConfig.referrer?form.get(registrationConfig.referrer).trim():''};questions=pickUniqueQuestions(bank,QUESTION_COUNT);$('registration').hidden=true;$('quiz').hidden=false;render();});
if($('gradeStart'))$('gradeStart').onclick=()=>{$('landing').hidden=true;$('registration').hidden=false;};
$('actionButton').onclick=confirmAnswer;
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!['INPUT','BUTTON'].includes(document.activeElement.tagName)){event.preventDefault();if(!$('quiz').hidden&&!$('actionButton').disabled)$('actionButton').click();}});
let installPrompt;
const installButton=$('installApp'),installHint=$('installHint');
const isIos=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
if(!isStandalone&&isIos&&installHint){installHint.hidden=false;installHint.textContent='iPhone/iPad：点浏览器底部的「分享」按钮，再选择「加入主画面」，即可像 App 一样使用。';}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;if(installButton)installButton.hidden=false;});
installButton?.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();const choice=await installPrompt.userChoice;if(choice.outcome==='accepted')installButton.hidden=true;installPrompt=null;});
window.addEventListener('appinstalled',()=>{if(installButton)installButton.hidden=true;if(installHint){installHint.hidden=false;installHint.textContent='安装完成：可从手机桌面直接打开，也支持离线答题。';}});
