SWIFT_FILE=Pods/Nimble-Snapshots/HaveValidSnapshot.swift

OBJ_H_FILE=Pods/Expecta+Snapshots/EXPMatchers+FBSnapshotTest.h
OBJ_M_FILE=Pods/Expecta+Snapshots/EXPMatchers+FBSnapshotTest.m

TEMP_FILE=.recordingSnapshots


if ! test -f "$TEMP_FILE"; then
	exit
fi


perl -pi -e 's/(switchChecksWithRecords = )true/$1false/g' $SWIFT_FILE

perl -pi -e 's/haveValidSnapshot,/recordSnapshot,/' $OBJ_H_FILE
perl -pi -e 's/haveValidSnapshotNamed,/recordSnapshotNamed,/' $OBJ_H_FILE
perl -pi -e 's/oldHaveValidSnapshot,/haveValidSnapshot,/' $OBJ_H_FILE
perl -pi -e 's/oldHaveValidSnapshotNamed,/haveValidSnapshotNamed,/' $OBJ_H_FILE

perl -pi -e 's/haveValidSnapshot,/recordSnapshot,/' $OBJ_M_FILE
perl -pi -e 's/haveValidSnapshotNamed,/recordSnapshotNamed,/' $OBJ_M_FILE
perl -pi -e 's/oldHaveValidSnapshot,/haveValidSnapshot,/' $OBJ_M_FILE
perl -pi -e 's/oldHaveValidSnapshotNamed,/haveValidSnapshotNamed,/' $OBJ_M_FILE


rm -rf $TEMP_FILE
