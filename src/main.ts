#!/usr/bin/env node
import {readFileSync} from 'fs';
import {argv} from 'process';
import FsMeta from './types';
import FsView from './FsView';

if (argv.length < 3)
    throw 'specify data dump';

const data : FsMeta[] = <FsMeta[]>JSON.parse(readFileSync(argv[2], 'utf-8'));

const studentView = new FsView(data, 'student');
console.log(studentView.toString());

