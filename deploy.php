<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'planningpoker');

// Project repository
set('repository', 'https://github.com/wdev-rs/planningpoker.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Shared files/dirs between deploys
add('shared_files', []);
add('shared_dirs', []);

// Writable dirs by web server
add('writable_dirs', []);
set('allow_anonymous_stats', false);

// Hosts

host('planningpoker.wdev.rs')
    ->set('remote_user', 'deploy')
    ->set('deploy_path', '/var/www/vhosts/planningpoker.wdev.rs')
    ->set('keep_releases', '2');

// Tasks

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

task('npm:install', function () {
    run('cd {{release_path}} && npm ci');
});

task('express:start', function () {
    try {
        run('cd {{release_path}} && pm2 delete all');
    }
    catch (\Deployer\Exception\Exception $e) {
        writeln("no process to delete");
    }

    run('cd {{release_path}} && pm2 start express.js');
});

before('deploy:symlink', 'npm:install');

after('npm:install', 'express:start');
