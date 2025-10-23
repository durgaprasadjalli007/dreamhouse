trigger CaseTrigger on Case (after insert, after update, after delete, after undelete) {
    CaseTriggerHandler.updateHighPriorityCaseCounts(
        Trigger.new, 
        Trigger.old, 
        Trigger.isInsert, 
        Trigger.isUpdate, 
        Trigger.isDelete, 
        Trigger.isUndelete
    );
    if (Trigger.isAfter) {
        if (Trigger.isInsert || Trigger.isUndelete) {
            CaseTriggerHandler.updateLatestCaseDate(Trigger.new);
        }
        if (Trigger.isDelete) {
            CaseTriggerHandler.updateLatestCaseDate(Trigger.old);
        }
    }
}