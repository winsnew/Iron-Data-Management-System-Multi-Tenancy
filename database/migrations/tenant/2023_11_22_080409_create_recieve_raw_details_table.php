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
        Schema::create('pc_recieve_raw_detail', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->integer('pc_recieve_raw_id')->unsigned();
            $table->foreign('pc_recieve_raw_id')->references('id')->on('pc_recieve_raw')->onDelete('cascade');
            $table->integer('pc_order_raw_detail_id')->unsigned();
            $table->foreign('pc_order_raw_detail_id')->references('id')->on('pc_order_raw_detail')->onDelete('cascade');
            $table->string('reff_po');
            $table->string('code');
            $table->text('size');
            $table->string('weight');
            $table->string('price');
            $table->string('delivery_cost');
            $table->string('qty_rcv');
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
        Schema::dropIfExists('pc_recieve_raw_detail');
    }
};
