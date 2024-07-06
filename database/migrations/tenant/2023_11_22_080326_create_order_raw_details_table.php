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
        Schema::create('pc_order_raw_detail', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->integer('pc_order_raw_id')->unsigned();
            $table->foreign('pc_order_raw_id')->references('id')->on('pc_order_raw')->onDelete('cascade');
            $table->integer('raw_product_id')->unsigned();
            $table->foreign('raw_product_id')->references('id')->on('ms_raw_product')->onDelete('cascade');
            $table->string('code');
            $table->string('material');
            $table->text('size');
            $table->string('status');
            $table->string('note');
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
        Schema::dropIfExists('pc_order_raw_detail');
    }
};
