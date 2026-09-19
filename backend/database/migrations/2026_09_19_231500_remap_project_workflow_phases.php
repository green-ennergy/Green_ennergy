<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const MAP = [
        'premier_contact' => 'quote_confirmed',
        'data_collection' => 'order_prep',
        'energy_data' => 'installation',
    ];

    public function up(): void
    {
        foreach (self::MAP as $from => $to) {
            DB::table('projects')->where('status', $from)->update(['status' => $to]);
        }

        $projects = DB::table('projects')->whereNotNull('completed_steps')->get(['id_project', 'completed_steps']);

        foreach ($projects as $project) {
            $steps = json_decode($project->completed_steps, true);
            if (! is_array($steps)) {
                continue;
            }

            $mapped = [];
            foreach ($steps as $step) {
                $key = self::MAP[$step] ?? $step;
                if (! in_array($key, $mapped, true)) {
                    $mapped[] = $key;
                }
            }

            $order = ['quote_confirmed', 'order_prep', 'installation', 'completed'];
            $mapped = array_values(array_intersect($order, $mapped));

            DB::table('projects')->where('id_project', $project->id_project)->update([
                'completed_steps' => json_encode($mapped),
            ]);
        }
    }

    public function down(): void
    {
        $reverse = array_flip(self::MAP);

        foreach ($reverse as $from => $to) {
            DB::table('projects')->where('status', $from)->update(['status' => $to]);
        }

        $projects = DB::table('projects')->whereNotNull('completed_steps')->get(['id_project', 'completed_steps']);

        foreach ($projects as $project) {
            $steps = json_decode($project->completed_steps, true);
            if (! is_array($steps)) {
                continue;
            }

            $mapped = [];
            foreach ($steps as $step) {
                $key = $reverse[$step] ?? $step;
                if (! in_array($key, $mapped, true)) {
                    $mapped[] = $key;
                }
            }

            $order = ['premier_contact', 'data_collection', 'energy_data', 'completed'];
            $mapped = array_values(array_intersect($order, $mapped));

            DB::table('projects')->where('id_project', $project->id_project)->update([
                'completed_steps' => json_encode($mapped),
            ]);
        }
    }
};
