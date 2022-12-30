#!/bin/sh
DOW=$(date +"%a")
HOME="/home/rammohanyadavalli"
SOURCE_FOLDER="$HOME/Pictures/master/$DOW"
TARGET_FOLDER="$HOME/Pictures/slideshow/$DOW"
echo $SOURCE_FOLDER
rm -r $TARGET_FOLDER
echo $SOURCE_FOLDER $TARGET_FOLDER
mkdir -p $TARGET_FOLDER
cp $SOURCE_FOLDER/* $TARGET_FOLDER