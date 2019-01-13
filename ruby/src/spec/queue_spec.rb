# frozen_string_literal: true

require 'queue'

def test_queue(queue, queue_type)
  describe queue_type do
    it 'should enqueue and dequeue properly' do
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)

      expect(queue.size).to eq 3
      expect(queue.peek).to eq 1

      expect(queue.dequeue).to eq 1
      expect(queue.to_array).to eq [2, 3]

      queue.enqueue(4)
      queue.enqueue(5)
      queue.enqueue(6)

      expect(queue.to_array).to eq [2, 3, 4, 5, 6]

      queue.clear

      expect(queue.empty?).to be true
      expect { queue.peek }.to raise_error('Queue is empty')
      expect { queue.dequeue }.to raise_error('Queue is empty')
    end
  end
end

queue = DataStructures::ArrayQueue.new
test_queue(queue, 'Array Queue')
