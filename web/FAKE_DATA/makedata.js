const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const numRuns = parseInt(process.argv[2]) || 3;
const baseDir = path.join(__dirname, 'runs');

// Ensure base directory exists
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

async function runTest(runNumber) {
    const runDir = path.join(baseDir, `run_${runNumber}`);
    
    // Create run directory
    if (!fs.existsSync(runDir)) {
        fs.mkdirSync(runDir);
    }

    return new Promise((resolve, reject) => {
        console.log(`\nStarting run ${runNumber}...`);
        
        exec('node fakedata.js', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Run ${runNumber} failed:`, error);
                reject(error);
                return;
            }

            // Move generated files to run directory
            const files = fs.readdirSync(__dirname);
            files.forEach(file => {
                if (file.match(/^(work|bio)\d+\.(json|html)$/) || 
                    file.match(/^data.*\.json$/)) {
                    fs.renameSync(
                        path.join(__dirname, file),
                        path.join(runDir, file)
                    );
                }
            });

            // Save output log
            fs.writeFileSync(
                path.join(runDir, 'output.log'),
                stdout + (stderr ? '\nErrors:\n' + stderr : '')
            );

            console.log(`Completed run ${runNumber}`);
            resolve();
        });
    });
}

async function runTests() {
    console.log(`Starting ${numRuns} test runs...`);
    
    for (let i = 1; i <= numRuns; i++) {
        try {
            await runTest(i);
        } catch (err) {
            console.error(`Run ${i} failed:`, err);
        }
    }
    
    console.log('\nAll test runs complete.');
}

runTests();
