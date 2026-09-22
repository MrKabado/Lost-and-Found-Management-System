<?php

namespace App\Console\Commands;

use App\Models\FoundItem;
use App\Models\LostItem;
use Illuminate\Console\Command;

class MarkUnclaimedItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'items:mark-unclaimed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark available items with no claim after 90 days as unclaimed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $cutoff = now()->subDays(90);
        $foundCount = FoundItem::where('status', 'available')->where('created_at', '<', $cutoff)->update(['status' => 'unclaimed']);
        $lostCount = LostItem::where('status', 'available')->where('created_at', '<', $cutoff)->update(['status' => 'unclaimed']);

        $this->info("Marked {$foundCount} found and {$lostCount} lost items as unclaimed.");

        return self::SUCCESS;
    }
}
