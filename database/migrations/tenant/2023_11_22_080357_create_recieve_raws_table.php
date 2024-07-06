<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pc_recieve_raw', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('recieve_raw_no');
            $table->integer('werehouse_id')->unsigned();
            $table->foreign('werehouse_id')->references('id')->on('ms_warehouse')->onDelete('cascade');
            $table->string('weight_recieve_total');
            $table->string('amount_recieve_total');
            $table->text('note');
            $table->string('status');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('deleted_at')->nullable();
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pc_recieve_raw');
    }
};
