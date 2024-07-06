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
        Schema::create('pc_buy_raw_detail', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->integer('pc_buy_raw_id')->unsigned();
            $table->foreign('pc_buy_raw_id')->references('id')->on('pc_buy_raw')->onDelete('cascade');
            $table->integer('pc_recieve_raw_id')->unsigned();
            $table->foreign('pc_recieve_raw_id')->references('id')->on('pc_recieve_raw')->onDelete('cascade');
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
        Schema::dropIfExists('pc_buy_raw_detail');
    }
};
