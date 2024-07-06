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
        Schema::create('pc_order_raw', function (Blueprint $table) {
            $table->increments('id')->index();
            $table->string('order_raw_no');
            $table->string('date');
            $table->integer('supplier_id')->unsigned();
            $table->foreign('supplier_id')->references('id')->on('ms_supplier')->onDelete('cascade');
            $table->string('weight_order_total');
            $table->text('price_order_total');
            $table->string('amount_order_total');
            $table->string('note');
            $table->string('status');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pc_order_raw');
    }
};
