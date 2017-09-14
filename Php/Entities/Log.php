<?php

namespace Apps\BackupApp\Php\Entities;

use Apps\Webiny\Php\Lib\Entity\Indexes\IndexContainer;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class Log
 *
 * @property string  $id
 * @property integer $successful
 * @property string  $log
 * @property string  $executionTime
 * @property object  $backupsCreated
 */
class Log extends AbstractEntity
{
    protected static $classId = 'BackupApp.Entities.Log';
    protected static $entityCollection = 'BackupAppLog';
    protected static $entityMask = '{id}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('successful')->boolean()->setToArrayDefault();
        $this->attr('executionTime')->char()->setToArrayDefault();
        $this->attr('log')->char();
        $this->attr('backupsCreated')->object();
    }

    protected static function entityIndexes(IndexContainer $indexes)
    {
        parent::entityIndexes($indexes);
        // expire after 60 days
        $indexes->add(new SingleIndex('createdOn', 'createdOn', false, false, false, 5184000));
    }
}