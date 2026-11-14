import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'};
function git(args){return execFileSync('git',args,{cwd,env,encoding:'utf8',timeout:60000,stdio:['ignore','pipe','pipe']}).trim();}
try{
 const remote=git(['remote','get-url','--push','origin']);
 if(remote!=='https://github.com/salbatro-p/nasa-app-moro.git'&&remote!=='https://github.com/salbatro-p/nasa-app-moro')throw Error('origin must point to salbatro-p/nasa-app-moro. No remote was changed.');
 if(git(['status','--porcelain']))throw Error('Commit the intended changes before synchronization.');
 const sha=git(['rev-parse','HEAD']);
 git(['push','origin','HEAD:refs/heads/main']);
 const remoteSha=git(['ls-remote','origin','refs/heads/main']).split(/\s+/)[0];
 if(remoteSha!==sha)throw Error('Remote verification did not match the delivered commit.');
 console.log(`Verified GitHub synchronization: ${sha}\nhttps://github.com/salbatro-p/nasa-app-moro/commit/${sha}`);
}catch(error){
 console.error('GitHub synchronization failed. Work remains saved locally.');
 console.error(error.stderr?.toString().trim()||error.message);
 process.exitCode=1;
}
