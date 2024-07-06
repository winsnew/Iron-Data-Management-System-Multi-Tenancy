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
        Schema::create('stock_raw_detail', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->integer('stock_raw_id')->unsigned();
            $table->foreign('stock_raw_id')->references('id')->on('stock_raw')->onDelete('cascade');
            $table->integer('pc_buy_raw_id')->unsigned();
            $table->foreign('pc_buy_raw_id')->references('id')->on('pc_buy_raw')->onDelete('cascade');
            $table->string('pr_result_id');
            $table->string('type');
            $table->string('tr_no');
            $table->text('date');
            $table->string('qty_in');
            $table->string('qty_out');
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
        Schema::dropIfExists('stock_raw_detail');
    }
};
