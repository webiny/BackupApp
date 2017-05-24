<?php
namespace Apps\BackupApp\Php\Entities;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\DevTools\Entity\AbstractEntity;

/**
 * Class Backups
 *
 * @property string  $id
 * @property integer $order
 * @property string  $name
 * @property integer $size
 * @property integer $dateCreated
 * @property boolean $encrypted
 * @property string  $filename
 * @property string  $status
 *
 * @package Apps\Webiny\Php\Entities
 *
 */
class Backup extends AbstractEntity
{
    use WebinyTrait;

    protected static $entityCollection = 'BackupAppBackup';
    protected static $entityMask = '{name}';

    public function __construct()
    {
        parent::__construct();

        $this->attr('order')->integer()->setToArrayDefault();
        $this->attr('name')->char()->setToArrayDefault();
        $this->attr('size')->integer()->setToArrayDefault();
        $this->attr('dateCreated')->datetime()->setToArrayDefault();
        $this->attr('encrypted')->boolean()->setToArrayDefault();
        $this->attr('filename')->char()->setToArrayDefault();
    }
}