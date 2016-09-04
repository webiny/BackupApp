<?php
namespace Apps\BackupApp\Php\Entities;

use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Log
 *
 * @property string       $id
 * @property integer      $successful
 * @property string       $log
 * @property string       $executionTime
 * @property object       $backupsCreated
 *
 * @package Apps\Core\Php\Entities
 *
 */
class Log extends AbstractEntity
{
    use WebinyTrait;

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
}