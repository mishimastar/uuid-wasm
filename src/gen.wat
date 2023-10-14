(module
    (import "wasi_snapshot_preview1" "clock_time_get"
        (func $wasi_clock_time_get (param (;clock_id;) i32 (;precision;) i64 (;time_pointer;) i32) (result (;pointer;) i32))
    )
        (import "wasi_snapshot_preview1" "random_get"
        (func $wasi_get_random (param (;pointer;) i32) (param (;len;) i32) (result (;status;) i32))
    )
    ;; gen
    (memory (export "memory") 1)
    (data (i32.const 16) "0123456789abcdef")
    (global $current (mut i32) (i32.const 32))
    (global $prev (mut i64) (i64.const 0))

    (func (export "_initialize")
        (call $getRandomPart (i32.const 8) (i32.const 32))
        (call $getRandomPart (i32.const 8) (i32.const 80))
        (call $getRandomPart (i32.const 8) (i32.const 128))
        (call $getRandomPart (i32.const 8) (i32.const 176))
        (call $getRandomPart (i32.const 8) (i32.const 224))
        (call $getRandomPart (i32.const 8) (i32.const 272))
        (call $getRandomPart (i32.const 8) (i32.const 320))
        (call $getRandomPart (i32.const 8) (i32.const 368))
        (call $getRandomPart (i32.const 8) (i32.const 416))
        (call $getRandomPart (i32.const 8) (i32.const 464))
        (call $wasi_clock_time_get (i32.const 0) (i64.const 1) (i32.const 0))
        drop
        (i64.load (i32.const 0))
        (i64.div_u (i64.const 100))
        (i64.add (i64.const 122192928000000000))
        (global.set $prev)

    )

    (func $getRandomPart (param $rand i32) (param $data i32)
        (call $wasi_get_random (local.get $rand) (i32.const 8))
        drop
        (i32.store8 (i32.add (local.get $data) (i32.const 8)) (i32.const 45)) ;; -
        (i32.store8 (i32.add (local.get $data) (i32.const 13)) (i32.const 45)) ;; -
        (i32.store8 (i32.add (local.get $data) (i32.const 14)) (i32.const 49)) ;; 1
        (call $i8toa16 (i32.load8_u (local.get $rand)) (i32.add (local.get $data) (i32.const 19)))
        (i32.store8 (i32.add (local.get $data) (i32.const 18)) (i32.const 45)) ;; -
        (i32.store8 (i32.add (local.get $data) (i32.const 19)) (i32.const 57)) ;;9 variant
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 1))) (i32.add (local.get $data) (i32.const 21)))
        (i32.store8 (i32.add (local.get $data) (i32.const 23)) (i32.const 45)) ;; -
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 2))) (i32.add (local.get $data) (i32.const 24)))
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 3))) (i32.add (local.get $data) (i32.const 26)))
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 4))) (i32.add (local.get $data) (i32.const 28)))
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 5))) (i32.add (local.get $data) (i32.const 30)))
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 6))) (i32.add (local.get $data) (i32.const 32)))
        (call $i8toa16 (i32.load8_u (i32.add (local.get $rand) (i32.const 7))) (i32.add (local.get $data) (i32.const 34)))
    )

    (func $i8toa16 (param $num (;expect uint8;) i32) (param $ptr i32)
        (local $numtmp i64)
        (local $numlen i32)
        (local $writeidx i32)
        (local $digit i64)
        (local $dchar i64)

        (i32.add (local.get $ptr) (i32.const 1))
        (i32.and (local.get $num) (i32.const 15))
        (i32.add (i32.const 16))
        (i32.load8_u)
        (i32.store8)

        (local.get $ptr)
        (i32.shr_u (local.get $num) (i32.const 4))
        (i32.add (i32.const 16))
        (i32.load8_u)
        (i32.store8)
    )

    (func (export "nanos") (result i64)
        (call $wasi_clock_time_get (i32.const 0) (i64.const 1) (i32.const 0))
        drop
        (i64.load (i32.const 0))
    )

    (func (export "gen") (result i32)
        (local $ss i64)
        ;; (local $buf i64)
        (call $wasi_clock_time_get (i32.const 0) (i64.const 1) (i32.const 0))
        (i64.load)
        (i64.div_u (i64.const 100))
        (i64.add (i64.const 122192928000000000))
        (local.set $ss)
        (if 
            (i64.eq (local.get $ss) (global.get $prev))
            (then
                (i32.add (global.get $current) (i32.const 48))
                (global.set $current)
                (if 
                    (i32.gt_u (global.get $current) (i32.const 464))
                    (then (i32.const 32) (global.set $current))
                )
            )
        )
        ;; (loop $uniq
        ;;     (call $wasi_clock_time_get (i32.const 2) (i64.const 1) (i32.const 0))
        ;;     (i64.load)
        ;;     (global.get $starttime)
        ;;     (i64.add)
        ;;     (i64.div_u (i64.const 100))
        ;;     (local.set $ss)
        ;;     (i64.ne (local.get $ss) (global.get $prev))
        ;;     br_if $uniq
        ;; )

        (i32.add (global.get $current) (i32.const 15))
        (i32.add (global.get $current) (i32.const 16)) ;; high
        (i32.add (global.get $current) (i32.const 17))
        
        (i32.add (global.get $current) (i32.const 9))
        (i32.add (global.get $current) (i32.const 10)) ;; mid
        (i32.add (global.get $current) (i32.const 11))
        (i32.add (global.get $current) (i32.const 12))

        (global.get $current) 
        (i32.add (global.get $current) (i32.const 1))
        (i32.add (global.get $current) (i32.const 2))
        (i32.add (global.get $current) (i32.const 3)) ;; low
        (i32.add (global.get $current) (i32.const 4))
        (i32.add (global.get $current) (i32.const 5))
        (i32.add (global.get $current) (i32.const 6))
        (i32.add (global.get $current) (i32.const 7))

        (local.get $ss)
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 4))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 8))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 12))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 16))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 20))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 24))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 28))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 32))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 36))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 40))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 44))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 48))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 52))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss)
        (i64.shr_u (i64.const 56))
        (i32.wrap_i64 (i64.and (i64.const 15)))
        (i32.load8_u offset=16)
        (i32.store8)

        (local.get $ss) 
        (global.set $prev)
        (global.get $current)
    )
)